import { describe, it, expect } from 'vitest';
import {
  ClassificationSchema,
  CompletenessScoreSchema,
  ResponseDraftSchema,
  FullAnalysisSchema,
} from '../../apps/api/src/ai/schemas.js';

describe('AI Output Schema Runtime Validations', () => {
  it('validates a correct dispute classification object', () => {
    const validClassification = {
      reason: 'ITEM_NOT_RECEIVED',
      severity: 3,
      urgency: 'HIGH',
      confidence: 0.95,
      summary: 'Buyer claims item was not received despite tracking confirmation.',
      keyIssue: 'Delivery confirmed to recipient postal code.',
    };

    const parsed = ClassificationSchema.parse(validClassification);
    expect(parsed.reason).toBe('ITEM_NOT_RECEIVED');
    expect(parsed.severity).toBe(3);
    expect(parsed.confidence).toBe(0.95);
  });

  it('rejects an invalid severity or out-of-range confidence', () => {
    const invalid = {
      reason: 'ITEM_NOT_RECEIVED',
      severity: 10, // Invalid: max 5
      urgency: 'HIGH',
      confidence: 1.5, // Invalid: max 1
      summary: 'Too short',
      keyIssue: 'Issue',
    };

    expect(() => ClassificationSchema.parse(invalid)).toThrow();
  });

  it('validates completeness score bounded between 0 and 100', () => {
    const validCompleteness = {
      overallScore: 88,
      breakdown: [
        {
          category: 'Carrier Shipping Proof',
          score: 95,
          maxScore: 100,
          present: ['Carrier Name', 'Tracking Number'],
          missing: [],
        },
      ],
      overallAssessment: 'Strong evidence meets Seller Protection criteria.',
      recommendationToImprove: ['Attach GPS scan if available'],
    };

    const parsed = CompletenessScoreSchema.parse(validCompleteness);
    expect(parsed.overallScore).toBe(88);
    expect(parsed.breakdown[0].present).toContain('Carrier Name');
  });

  it('enforces citations in response draft sections to prevent hallucination', () => {
    const draftWithCitations = {
      subject: 'Dispute Contestation: PP-D-10291',
      body: 'Formal contestation with proof of delivery.',
      sections: [
        {
          heading: 'Delivery Proof',
          content: 'Carrier tracking shows delivery to confirmed address.',
          citations: [
            {
              source: 'TrackingRecord',
              reference: 'USPS-9400111899562537829102',
              detail: 'Delivered to front porch',
            },
          ],
        },
      ],
      tone: 'FACTUAL_ASSERTIVE',
      keyArguments: ['Delivered prior to dispute filing'],
      suggestedAction: 'CONTEST_WITH_EVIDENCE',
    };

    const parsed = ResponseDraftSchema.parse(draftWithCitations);
    expect(parsed.sections[0].citations).toHaveLength(1);
    expect(parsed.sections[0].citations[0].reference).toBe('USPS-9400111899562537829102');
  });
});

