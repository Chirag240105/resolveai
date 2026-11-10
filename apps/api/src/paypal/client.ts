import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/errors.js';
import type { PayPalDispute, PayPalOAuthToken, PayPalOrder } from '../types/index.js';

interface WebhookVerificationPayload {
  auth_algo: string;
  cert_url: string;
  transmission_id: string;
  transmission_sig: string;
  transmission_time: string;
  webhook_id: string;
  webhook_event: Record<string, unknown>;
}

export class PayPalClient {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private cachedToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(clientId = env.PAYPAL_CLIENT_ID, clientSecret = env.PAYPAL_CLIENT_SECRET, baseUrl = env.PAYPAL_BASE_URL) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async getAccessToken(): Promise<string> {
    if (this.cachedToken && Date.now() < this.tokenExpiresAt - 60000) {
      return this.cachedToken;
    }

    if (!this.clientId || !this.clientSecret) {
      if (env.DEMO_MODE) {
        return 'mock-sandbox-token';
      }
      throw new AppError('PayPal client ID or secret is not configured', 500);
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error({ status: response.status, body: errorText }, 'PayPal OAuth token retrieval failed');
      throw new AppError(`PayPal OAuth failure: ${response.statusText}`, response.status);
    }

    const data = (await response.json()) as PayPalOAuthToken;
    this.cachedToken = data.access_token;
    this.tokenExpiresAt = Date.now() + data.expires_in * 1000;
    return this.cachedToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errBody = await response.text();
      logger.error({ endpoint, status: response.status, body: errBody }, 'PayPal API request error');
      throw new AppError(`PayPal API Error [${response.status}] ${endpoint}: ${errBody}`, response.status);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  }

  async createOrder(data: {
    amount: string;
    currency?: string;
    invoiceId?: string;
    description?: string;
  }): Promise<PayPalOrder> {
    return this.request<PayPalOrder>('/v2/checkout/orders', {
      method: 'POST',
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            invoice_id: data.invoiceId,
            description: data.description || 'ResolveAI Merchant Order',
            amount: {
              currency_code: data.currency || 'USD',
              value: data.amount,
            },
          },
        ],
      }),
    });
  }

  async captureOrder(orderId: string): Promise<PayPalOrder> {
    return this.request<PayPalOrder>(`/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
    });
  }

  async listDisputes(params?: { disputeState?: string; pageSize?: number }): Promise<{ items: PayPalDispute[] }> {
    const query = new URLSearchParams();
    if (params?.disputeState) query.set('dispute_state', params.disputeState);
    if (params?.pageSize) query.set('page_size', params.pageSize.toString());
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<{ items: PayPalDispute[] }>(`/v1/customer/disputes${qs}`);
  }

  async getDispute(disputeId: string): Promise<PayPalDispute> {
    return this.request<PayPalDispute>(`/v1/customer/disputes/${disputeId}`);
  }

  async provideEvidence(
    disputeId: string,
    evidence: {
      evidence_type: string;
      notes?: string;
      tracking_info?: Array<{
        carrier_name: string;
        tracking_number: string;
      }>;
    }
  ): Promise<void> {
    await this.request<void>(`/v1/customer/disputes/${disputeId}/provide-evidence`, {
      method: 'POST',
      body: JSON.stringify(evidence),
    });
  }

  async acceptClaim(disputeId: string, note?: string): Promise<void> {
    await this.request<void>(`/v1/customer/disputes/${disputeId}/accept-claim`, {
      method: 'POST',
      body: JSON.stringify({ note: note || 'Merchant accepted claim via ResolveAI' }),
    });
  }

  async verifyWebhookSignature(payload: WebhookVerificationPayload): Promise<boolean> {
    try {
      const result = await this.request<{ verification_status: string }>('/v1/notifications/verify-webhook-signature', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return result.verification_status === 'SUCCESS';
    } catch (err) {
      logger.error({ err }, 'Webhook signature verification threw an exception');
      return false;
    }
  }
}

export const paypalClient = new PayPalClient();
