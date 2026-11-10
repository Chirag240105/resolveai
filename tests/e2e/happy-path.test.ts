import { describe, it, expect } from 'vitest';
import { DisputeAiPipeline } from '../../apps/api/src/ai/pipeline.js';

describe('End-to-End Happy Path Simulation', () => {
  const pipeline = new DisputeAiPipeline();

  it('runs rule-based analysis and produces compliant output schema', () => {
    const mockDispute = {
      id: 'disp-e2e',
      paypalDisputeId: 'PP-D-E2E-1',
      reason: 'ITEM_NOT_RECEIVED',
      disputeAmount: 189.99,
      disputeCurrency: 'USD',
      sellerResponseDueDate: new Date(Date.now() + 86400000 * 3),
      transaction: {
        paypalOrderId: 'ORD-E2E-100',
        paypalCaptureId: 'CAP-E2E-100',
        payerEmail: 'customer@example.com',
        shippingAddress: { city: 'San Jose', state: 'CA' },
        trackingInfo: {
          carrier: 'USPS',
          trackingNumber: '9400111899562537829102',
          status: 'DELIVERED',
        },
      },
      evidence: [],
      merchant: { businessName: 'Test Electronics' },
    };

    // Access the rule-based generation directly
    const result = (pipeline as any).generateRuleBasedAnalysis(mockDispute);

    expect(result.classification.reason).toBe('ITEM_NOT_RECEIVED');
    expect(result.completeness.overallScore).toBeGreaterThanOrEqual(80);
    expect(result.riskAssessment.winProbability).toBeGreaterThan(0.7);
    expect(result.responseDraft.sections.length).toBeGreaterThan(0);
    expect(result.responseDraft.sections[0].citations.length).toBeGreaterThan(0);
    expect(result.responseDraft.suggestedAction).toBe('CONTEST_WITH_EVIDENCE');
  });
});

