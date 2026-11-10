import { prisma } from '../utils/db.js';
import { paypalClient } from '../paypal/client.js';
import { auditService } from './audit.service.js';
import { disputeAiPipeline } from '../ai/pipeline.js';
import { AppError, NotFoundError, ValidationError } from '../utils/errors.js';
import { env } from '../config/env.js';
import type { DisputeReason, DisputeStatus, DisputeOutcome } from '@prisma/client';

export class DisputeService {
  async listDisputes(params: {
    merchantId: string;
    status?: DisputeStatus;
    reason?: DisputeReason;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {
      merchantId: params.merchantId,
    };

    if (params.status) where.status = params.status;
    if (params.reason) where.reason = params.reason;
    if (params.search) {
      where.OR = [
        { paypalDisputeId: { contains: params.search, mode: 'insensitive' } },
        { transaction: { paypalOrderId: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.dispute.count({ where }),
      prisma.dispute.findMany({
        where,
        skip,
        take: limit,
        include: {
          transaction: true,
          aiAnalyses: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          evidence: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDisputeDetails(disputeId: string, merchantId: string) {
    const dispute = await prisma.dispute.findFirst({
      where: { id: disputeId, merchantId },
      include: {
        transaction: true,
        evidence: {
          include: { documents: true },
          orderBy: { createdAt: 'desc' },
        },
        aiAnalyses: {
          orderBy: { createdAt: 'desc' },
        },
        auditLogs: {
          include: { user: { select: { name: true, email: true, role: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!dispute) {
      throw new NotFoundError(`Dispute ${disputeId} not found`);
    }

    return dispute;
  }

  async syncDisputeFromPayPal(paypalDisputeId: string, merchantId: string, userId?: string) {
    let paypalData: any;

    try {
      paypalData = await paypalClient.getDispute(paypalDisputeId);
    } catch (err) {
      if (env.DEMO_MODE) {
        paypalData = {
          dispute_id: paypalDisputeId,
          dispute_amount: { value: '149.99', currency_code: 'USD' },
          reason: 'MERCHANDISE_OR_SERVICE_NOT_RECEIVED',
          status: 'WAITING_FOR_SELLER_RESPONSE',
          seller_response_due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
        };
      } else {
        throw err;
      }
    }

    // Attempt to match an existing transaction
    const matchedTx = await prisma.transaction.findFirst({
      where: {
        merchantId,
        OR: [
          { paypalOrderId: paypalData.disputed_transactions?.[0]?.buyer_transaction_id },
          { paypalCaptureId: paypalData.disputed_transactions?.[0]?.seller_transaction_id },
        ],
      },
    });

    const statusMap: Record<string, DisputeStatus> = {
      OPEN: 'OPEN',
      WAITING_FOR_SELLER_RESPONSE: 'WAITING_FOR_SELLER_RESPONSE',
      WAITING_FOR_BUYER_RESPONSE: 'WAITING_FOR_BUYER_RESPONSE',
      UNDER_REVIEW: 'UNDER_REVIEW',
      RESOLVED: 'RESOLVED',
      CLOSED: 'CLOSED',
    };

    const reasonMap: Record<string, DisputeReason> = {
      MERCHANDISE_OR_SERVICE_NOT_RECEIVED: 'ITEM_NOT_RECEIVED',
      UNAUTHORISED: 'UNAUTHORIZED_TRANSACTION',
      DUPLICATE_TRANSACTION: 'DUPLICATE_TRANSACTION',
      MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED: 'ITEM_NOT_AS_DESCRIBED',
    };

    const mappedReason: DisputeReason = reasonMap[paypalData.reason || paypalData.dispute_reason] || 'ITEM_NOT_RECEIVED';
    const mappedStatus: DisputeStatus = statusMap[paypalData.status] || 'OPEN';

    const dispute = await prisma.dispute.upsert({
      where: { paypalDisputeId },
      update: {
        status: mappedStatus,
        disputeAmount: Number(paypalData.dispute_amount?.value || 0),
        disputeCurrency: paypalData.dispute_amount?.currency_code || 'USD',
        sellerResponseDueDate: paypalData.seller_response_due_date ? new Date(paypalData.seller_response_due_date) : null,
        paypalDisputeData: paypalData,
        ...(matchedTx ? { transactionId: matchedTx.id } : {}),
      },
      create: {
        merchantId,
        paypalDisputeId,
        reason: mappedReason,
        status: mappedStatus,
        disputeAmount: Number(paypalData.dispute_amount?.value || 0),
        disputeCurrency: paypalData.dispute_amount?.currency_code || 'USD',
        sellerResponseDueDate: paypalData.seller_response_due_date ? new Date(paypalData.seller_response_due_date) : null,
        paypalDisputeData: paypalData,
        transactionId: matchedTx?.id,
      },
    });

    await auditService.log({
      action: 'DISPUTE_SYNCED',
      userId,
      disputeId: dispute.id,
      details: { paypalDisputeId, status: mappedStatus },
    });

    return dispute;
  }

  async triggerAiAnalysis(disputeId: string, merchantId: string, userId: string) {
    const dispute = await prisma.dispute.findFirst({
      where: { id: disputeId, merchantId },
    });

    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    await auditService.log({
      action: 'ANALYSIS_STARTED',
      userId,
      disputeId,
    });

    const result = await disputeAiPipeline.runAnalysis(disputeId);

    await auditService.log({
      action: 'ANALYSIS_COMPLETED',
      userId,
      disputeId,
      details: {
        completenessScore: result.completeness.overallScore,
        winProbability: result.riskAssessment.winProbability,
      },
    });

    return result;
  }

  async approveResponse(disputeId: string, merchantId: string, userId: string) {
    const dispute = await prisma.dispute.findFirst({
      where: { id: disputeId, merchantId },
      include: { aiAnalyses: { take: 1, orderBy: { createdAt: 'desc' } } },
    });

    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    if (dispute.aiAnalyses.length === 0) {
      throw new ValidationError('Cannot approve a dispute response before AI analysis has been generated');
    }

    const updated = await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        approvalStatus: 'APPROVED',
        approvedBy: userId,
        approvedAt: new Date(),
      },
    });

    await auditService.log({
      action: 'APPROVAL_GRANTED',
      userId,
      disputeId,
      details: { approvedAt: updated.approvedAt },
    });

    return updated;
  }

  async rejectResponse(disputeId: string, merchantId: string, userId: string, reason?: string) {
    const dispute = await prisma.dispute.findFirst({
      where: { id: disputeId, merchantId },
    });

    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    const updated = await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        approvalStatus: 'REJECTED',
      },
    });

    await auditService.log({
      action: 'APPROVAL_REJECTED',
      userId,
      disputeId,
      details: { reason },
    });

    return updated;
  }

  async submitToPayPal(disputeId: string, merchantId: string, userId: string) {
    const dispute = await prisma.dispute.findFirst({
      where: { id: disputeId, merchantId },
      include: {
        evidence: true,
        aiAnalyses: { take: 1, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!dispute) {
      throw new NotFoundError('Dispute not found');
    }

    // HARD DESIGN RULE ENFORCEMENT:
    // AI NEVER SUBMITS ALONE. Must have explicit human merchant approval.
    if (dispute.approvalStatus !== 'APPROVED') {
      throw new ValidationError(
        'Submission blocked: Dispute response must be explicitly approved by a verified merchant reviewer before submission to PayPal.'
      );
    }

    await auditService.log({
      action: 'SUBMISSION_STARTED',
      userId,
      disputeId,
    });

    try {
      const latestAnalysis = dispute.aiAnalyses[0];
      const draftBody = (latestAnalysis?.responseDraft as any)?.body || 'Response submitted with merchant evidence.';

      if (!env.DEMO_MODE) {
        await paypalClient.provideEvidence(dispute.paypalDisputeId, {
          evidence_type: 'PROOF_OF_FULFILLMENT',
          notes: draftBody,
        });
      }

      const updated = await prisma.dispute.update({
        where: { id: disputeId },
        data: {
          approvalStatus: 'SUBMITTED',
          submittedAt: new Date(),
          status: 'UNDER_REVIEW',
        },
      });

      await auditService.log({
        action: 'SUBMISSION_COMPLETED',
        userId,
        disputeId,
        details: { submittedAt: updated.submittedAt },
      });

      return updated;
    } catch (err) {
      await prisma.dispute.update({
        where: { id: disputeId },
        data: { approvalStatus: 'SUBMISSION_FAILED' },
      });

      await auditService.log({
        action: 'SUBMISSION_FAILED',
        userId,
        disputeId,
        details: { error: err instanceof Error ? err.message : 'Submission failed' },
      });

      throw new AppError(`Submission to PayPal failed: ${err instanceof Error ? err.message : 'Unknown error'}`, 502);
    }
  }

  async updateResponseDraft(disputeId: string, merchantId: string, userId: string, updatedDraft: any) {
    const dispute = await prisma.dispute.findFirst({
      where: { id: disputeId, merchantId },
      include: { aiAnalyses: { take: 1, orderBy: { createdAt: 'desc' } } },
    });

    if (!dispute || dispute.aiAnalyses.length === 0) {
      throw new NotFoundError('Dispute or analysis not found');
    }

    const latest = dispute.aiAnalyses[0];
    await prisma.aiAnalysis.update({
      where: { id: latest.id },
      data: {
        responseDraft: updatedDraft,
      },
    });

    await auditService.log({
      action: 'RESPONSE_EDITED',
      userId,
      disputeId,
    });

    return { success: true };
  }
}

export const disputeService = new DisputeService();

