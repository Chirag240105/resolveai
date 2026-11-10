import { describe, it, expect, vi } from 'vitest';
import { DisputeService } from '../../apps/api/src/services/dispute.service.js';
import { prisma } from '../../apps/api/src/utils/db.js';
import { paypalClient } from '../../apps/api/src/paypal/client.js';

describe('Dispute Human Approval Gate Enforcement', () => {
  const disputeService = new DisputeService();

  it('strictly blocks submission if dispute response is not explicitly approved', async () => {
    vi.spyOn(prisma.dispute, 'findFirst').mockResolvedValueOnce({
      id: 'disp-test-1',
      merchantId: 'merch-1',
      paypalDisputeId: 'PP-D-999',
      approvalStatus: 'PENDING_REVIEW', // Not approved!
      aiAnalyses: [{ responseDraft: { body: 'Draft' } }],
    } as any);

    await expect(
      disputeService.submitToPayPal('disp-test-1', 'merch-1', 'user-1')
    ).rejects.toThrow(/Submission blocked: Dispute response must be explicitly approved/);
  });

  it('allows submission when status is APPROVED', async () => {
    vi.spyOn(prisma.dispute, 'findFirst').mockResolvedValueOnce({
      id: 'disp-test-2',
      merchantId: 'merch-1',
      paypalDisputeId: 'PP-D-888',
      approvalStatus: 'APPROVED',
      aiAnalyses: [{ responseDraft: { body: 'Ready to submit' } }],
      evidence: [],
    } as any);

    vi.spyOn(paypalClient, 'provideEvidence').mockResolvedValueOnce(undefined);

    vi.spyOn(prisma.dispute, 'update').mockResolvedValueOnce({
      id: 'disp-test-2',
      approvalStatus: 'SUBMITTED',
      status: 'UNDER_REVIEW',
      submittedAt: new Date(),
    } as any);

    const result = await disputeService.submitToPayPal('disp-test-2', 'merch-1', 'user-1');
    expect(result.approvalStatus).toBe('SUBMITTED');
  });
});
