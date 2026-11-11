export type UserRole = 'MERCHANT' | 'REVIEWER' | 'ADMIN';

export type DisputeStatus =
  | 'OPEN'
  | 'WAITING_FOR_SELLER_RESPONSE'
  | 'WAITING_FOR_BUYER_RESPONSE'
  | 'UNDER_REVIEW'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ESCALATED';

export type DisputeReason =
  | 'ITEM_NOT_RECEIVED'
  | 'UNAUTHORIZED_TRANSACTION'
  | 'DUPLICATE_TRANSACTION'
  | 'ITEM_NOT_AS_DESCRIBED'
  | 'MERCHANDISE_OR_SERVICE_NOT_RECEIVED'
  | 'CREDIT_NOT_PROCESSED'
  | 'OTHER';

export type ApprovalStatus =
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUBMITTED'
  | 'SUBMISSION_FAILED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  merchantId?: string;
}

export interface Merchant {
  id: string;
  businessName: string;
  businessEmail?: string;
  paypalConnection?: {
    isActive: boolean;
    paypalMerchantId?: string;
    connectedAt: string;
  };
}

export interface Transaction {
  id: string;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  amount: number;
  currency: string;
  status: string;
  payerEmail?: string;
  payerName?: string;
  description?: string;
  itemDetails?: Array<{ name: string; quantity: number; unitAmount?: number }>;
  shippingAddress?: {
    recipientName?: string;
    line1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  trackingInfo?: {
    carrier?: string;
    trackingNumber?: string;
    status?: string;
    dispatchedAt?: string;
    deliveredAt?: string;
    signedBy?: string;
  };
}

export interface DisputeEvidence {
  id: string;
  disputeId: string;
  evidenceType: string;
  title: string;
  description?: string;
  sourceReference?: string;
  sourceData?: Record<string, unknown>;
  isAiGenerated: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface Citation {
  source: string;
  reference: string;
  detail: string;
}

export interface ResponseSection {
  heading: string;
  content: string;
  citations: Citation[];
}

export interface ResponseDraft {
  subject: string;
  body: string;
  sections: ResponseSection[];
  tone: string;
  keyArguments: string[];
  suggestedAction: string;
}

export interface AiAnalysis {
  id: string;
  disputeId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  completenessScore?: number;
  classification?: {
    reason: DisputeReason;
    severity: number;
    urgency: string;
    confidence: number;
    summary: string;
    keyIssue: string;
  };
  completeness?: {
    overallScore: number;
    breakdown: Array<{
      category: string;
      score: number;
      maxScore: number;
      present: string[];
      missing: string[];
    }>;
    overallAssessment: string;
    recommendationToImprove: string[];
  };
  riskAssessment?: {
    winProbability: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    factors: Array<{ factor: string; impact: string; description: string }>;
    strategicRecommendation: string;
  };
  weaknesses?: {
    weaknesses?: Array<{
      area: string;
      severity: string;
      description: string;
      recommendation: string;
    }>;
  } | string[];
  responseDraft?: ResponseDraft;
  citations?: Citation[];
  processingTimeMs?: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  disputeId?: string;
  merchantId?: string;
  action: string;
  details?: Record<string, unknown>;
  createdAt: string;
  user?: {
    id?: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface Dispute {
  id: string;
  merchantId: string;
  transactionId?: string;
  paypalDisputeId: string;
  reason: DisputeReason;
  status: DisputeStatus;
  disputeAmount: number;
  disputeCurrency: string;
  sellerResponseDueDate?: string;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  submittedAt?: string;
  createdAt: string;
  transaction?: Transaction;
  evidence?: DisputeEvidence[];
  aiAnalyses?: AiAnalysis[];
  auditLogs?: AuditLog[];
}

export interface DashboardKpis {
  kpis: {
    totalDisputes: number;
    activeDisputes: number;
    urgentDisputes: number;
    resolvedDisputes: number;
    totalDisputedAmount: number;
    averageCompletenessScore: number;
  };
  recentActivity: AuditLog[];
}
