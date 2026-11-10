import { z } from 'zod';

export const ClassificationSchema = z.object({
  reason: z.enum([
    'ITEM_NOT_RECEIVED',
    'UNAUTHORIZED_TRANSACTION',
    'DUPLICATE_TRANSACTION',
    'ITEM_NOT_AS_DESCRIBED',
    'MERCHANDISE_OR_SERVICE_NOT_RECEIVED',
    'CREDIT_NOT_PROCESSED',
    'OTHER',
  ]),
  severity: z.number().int().min(1).max(5).describe('1 is minor, 5 is critical/high loss'),
  urgency: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  confidence: z.number().min(0).max(1),
  summary: z.string().min(10),
  keyIssue: z.string(),
});

export const ExtractedEvidenceItemSchema = z.object({
  type: z.enum([
    'TRACKING_INFO',
    'SHIPPING_LABEL',
    'DELIVERY_CONFIRMATION',
    'INVOICE',
    'RECEIPT',
    'REFUND_CONFIRMATION',
    'CUSTOMER_COMMUNICATION',
    'PRODUCT_DESCRIPTION',
    'PROOF_OF_DELIVERY',
    'TERMS_AND_CONDITIONS',
    'SCREENSHOT',
    'OTHER',
  ]),
  title: z.string(),
  description: z.string(),
  sourceReference: z.string().describe('Must link explicitly to a real source entity like order_id or tracking_no'),
  sourceData: z.record(z.string(), z.unknown()).optional(),
  confidence: z.number().min(0).max(1),
});

export const EvidenceExtractionSchema = z.object({
  items: z.array(ExtractedEvidenceItemSchema),
});

export const CompletenessCategorySchema = z.object({
  category: z.string(),
  score: z.number().min(0).max(100),
  maxScore: z.number().default(100),
  missing: z.array(z.string()),
  present: z.array(z.string()),
});

export const CompletenessScoreSchema = z.object({
  overallScore: z.number().min(0).max(100),
  breakdown: z.array(CompletenessCategorySchema),
  overallAssessment: z.string(),
  recommendationToImprove: z.array(z.string()),
});

export const RiskFactorSchema = z.object({
  factor: z.string(),
  impact: z.enum(['HIGH_POSITIVE', 'POSITIVE', 'NEUTRAL', 'NEGATIVE', 'HIGH_NEGATIVE']),
  description: z.string(),
});

export const RiskAssessmentSchema = z.object({
  winProbability: z.number().min(0).max(1),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  factors: z.array(RiskFactorSchema),
  strategicRecommendation: z.string(),
});

export const WeaknessItemSchema = z.object({
  area: z.string(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  description: z.string(),
  recommendation: z.string(),
});

export const WeaknessSchema = z.object({
  weaknesses: z.array(WeaknessItemSchema),
});

export const CitationSchema = z.object({
  source: z.string().describe('e.g., TransactionRecord, ShippingLabel, OrderHistory'),
  reference: z.string().describe('ID or tracking number, e.g. TR-9821, FEDEX-12345'),
  detail: z.string(),
});

export const ResponseSectionSchema = z.object({
  heading: z.string(),
  content: z.string(),
  citations: z.array(CitationSchema),
});

export const ResponseDraftSchema = z.object({
  subject: z.string(),
  body: z.string(),
  sections: z.array(ResponseSectionSchema),
  tone: z.enum(['OBJECTIVE_FORMAL', 'FACTUAL_ASSERTIVE', 'CONCILIATORY']),
  keyArguments: z.array(z.string()),
  suggestedAction: z.enum(['CONTEST_WITH_EVIDENCE', 'ACCEPT_CLAIM_REFUND', 'REQUEST_RETURN_FIRST']),
});

export const FullAnalysisSchema = z.object({
  classification: ClassificationSchema,
  evidenceExtraction: EvidenceExtractionSchema,
  completeness: CompletenessScoreSchema,
  riskAssessment: RiskAssessmentSchema,
  weaknesses: WeaknessSchema,
  responseDraft: ResponseDraftSchema,
});

export type Classification = z.infer<typeof ClassificationSchema>;
export type ExtractedEvidenceItem = z.infer<typeof ExtractedEvidenceItemSchema>;
export type CompletenessScore = z.infer<typeof CompletenessScoreSchema>;
export type RiskAssessment = z.infer<typeof RiskAssessmentSchema>;
export type WeaknessReport = z.infer<typeof WeaknessSchema>;
export type ResponseDraft = z.infer<typeof ResponseDraftSchema>;
export type FullAnalysis = z.infer<typeof FullAnalysisSchema>;

