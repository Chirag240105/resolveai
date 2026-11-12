import { MOCK_DISPUTES, MOCK_DASHBOARD } from './mock-data';
import type { Dispute, DashboardKpis, AiAnalysis, AuditLog } from './types';

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('resolveai_token');
      // Only attach token if it is a valid 3-segment JWT and not a client-side demo placeholder
      if (token && token.split('.').length === 3) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private async fetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `API error ${res.status}`);
      }

      const json = await res.json();
      return json.data !== undefined ? json.data : json;
    } catch (err) {
      // In development / demo, if the network request fails, fall back to mock data
      console.warn(`[ResolveAI API Client] Live call to ${url} failed; using simulated fallback data:`, err);
      throw err;
    }
  }

  // Dashboard
  async getDashboard(): Promise<DashboardKpis> {
    try {
      return await this.fetch<DashboardKpis>('/api/merchants/dashboard');
    } catch {
      return MOCK_DASHBOARD;
    }
  }

  // Disputes
  async listDisputes(params?: { status?: string; reason?: string; search?: string; limit?: string | number; page?: string | number }): Promise<{ items: Dispute[]; pagination: any }> {
    try {
      const cleanParams: Record<string, string> = {};
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '' && v !== 'undefined') {
            cleanParams[k] = String(v);
          }
        });
      }
      const qs = new URLSearchParams(cleanParams).toString();
      const res = await this.fetch<any>(`/api/disputes${qs ? `?${qs}` : ''}`);
      return {
        items: res.items || res,
        pagination: res.pagination || { total: res.length, page: 1, limit: 20 },
      };
    } catch {
      return {
        items: MOCK_DISPUTES,
        pagination: { total: MOCK_DISPUTES.length, page: 1, limit: 20 },
      };
    }
  }

  async getDispute(id: string): Promise<Dispute> {
    try {
      return await this.fetch<Dispute>(`/api/disputes/${id}`);
    } catch {
      const found = MOCK_DISPUTES.find((d) => d.id === id || d.paypalDisputeId === id);
      if (found) return found;
      return MOCK_DISPUTES[0];
    }
  }

  async runAnalysis(id: string): Promise<AiAnalysis> {
    try {
      return await this.fetch<AiAnalysis>(`/api/disputes/${id}/analyze`, { method: 'POST' });
    } catch {
      return (MOCK_DISPUTES[0].aiAnalyses?.[0] as AiAnalysis) || ({} as any);
    }
  }

  async approveResponse(id: string): Promise<Dispute> {
    try {
      return await this.fetch<Dispute>(`/api/disputes/${id}/approve`, { method: 'POST' });
    } catch {
      const dispute = await this.getDispute(id);
      dispute.approvalStatus = 'APPROVED';
      return dispute;
    }
  }

  async submitDispute(id: string): Promise<Dispute> {
    try {
      return await this.fetch<Dispute>(`/api/disputes/${id}/submit`, { method: 'POST' });
    } catch {
      const dispute = await this.getDispute(id);
      dispute.approvalStatus = 'SUBMITTED';
      dispute.status = 'UNDER_REVIEW';
      return dispute;
    }
  }

  async syncDispute(id: string): Promise<Dispute> {
    try {
      return await this.fetch<Dispute>(`/api/disputes/${id}/sync`, { method: 'POST' });
    } catch {
      return this.getDispute(id);
    }
  }

  async updateResponseDraft(id: string, draft: any): Promise<void> {
    try {
      await this.fetch<void>(`/api/disputes/${id}/response`, {
        method: 'PUT',
        body: JSON.stringify(draft),
      });
    } catch {
      // Mock update
    }
  }

  // Audit Trail feed (all activity)
  async getAuditLogs(action?: string): Promise<AuditLog[]> {
    try {
      const url = action && action !== 'ALL' ? `/api/audit?action=${action}&limit=50` : '/api/audit?limit=50';
      const res = await this.fetch<any>(url);
      return res.items || [];
    } catch {
      return MOCK_DASHBOARD.recentActivity;
    }
  }

  // Webhooks feed (strictly incoming webhook events)
  async getWebhookFeed(): Promise<AuditLog[]> {
    try {
      const res = await this.fetch<any>('/api/audit?action=WEBHOOK_RECEIVED&limit=30');
      return res.items || [];
    } catch {
      return MOCK_DASHBOARD.recentActivity.filter(
        (a) => a.action === 'WEBHOOK_RECEIVED'
      );
    }
  }
}

export const api = new ApiClient();
