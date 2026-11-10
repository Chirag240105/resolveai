export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    errors?: unknown;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PayPalOAuthToken {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

export interface PayPalOrder {
  id: string;
  status: string;
  intent: string;
  purchase_units: Array<{
    reference_id?: string;
    amount: {
      currency_code: string;
      value: string;
    };
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
}

export interface PayPalDispute {
  dispute_id: string;
  create_time: string;
  update_time: string;
  dispute_amount: {
    currency_code: string;
    value: string;
  };
  status: string;
  dispute_reason: string;
  dispute_state?: string;
  dispute_life_cycle_stage?: string;
  dispute_channel?: string;
  seller_response_due_date?: string;
  disputed_transactions?: Array<{
    buyer_transaction_id?: string;
    seller_transaction_id?: string;
    create_time?: string;
    transaction_status?: string;
    gross_amount?: {
      currency_code: string;
      value: string;
    };
    invoice_number?: string;
    custom?: string;
  }>;
  messages?: Array<{
    posted_by: string;
    time_posted: string;
    content: string;
  }>;
}

export interface PayPalWebhookEvent {
  id: string;
  create_time: string;
  resource_type: string;
  event_type: string;
  summary: string;
  resource: Record<string, unknown>;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}
