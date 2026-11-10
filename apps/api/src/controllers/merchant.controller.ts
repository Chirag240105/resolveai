import type { Response } from 'express';
import { prisma } from '../utils/db.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { NotFoundError } from '../utils/errors.js';

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant profile not found');

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    include: {
      paypalConnection: {
        select: { isActive: true, paypalMerchantId: true, connectedAt: true },
      },
    },
  });

  return res.json({ success: true, data: merchant });
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant profile not found');

  const { businessName, businessEmail } = req.body;

  const updated = await prisma.merchant.update({
    where: { id: merchantId },
    data: { businessName, businessEmail },
  });

  return res.json({ success: true, data: updated });
}

export async function getDashboardKpis(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant profile not found');

  const now = new Date();
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const [
    totalDisputes,
    activeDisputes,
    urgentDisputes,
    resolvedDisputes,
    disputesList,
    recentAuditLogs,
    analyses,
  ] = await Promise.all([
    prisma.dispute.count({ where: { merchantId } }),
    prisma.dispute.count({
      where: {
        merchantId,
        status: { in: ['OPEN', 'WAITING_FOR_SELLER_RESPONSE', 'UNDER_REVIEW'] },
      },
    }),
    prisma.dispute.count({
      where: {
        merchantId,
        status: 'WAITING_FOR_SELLER_RESPONSE',
        sellerResponseDueDate: { lte: next24Hours },
      },
    }),
    prisma.dispute.count({
      where: { merchantId, status: { in: ['RESOLVED', 'CLOSED'] } },
    }),
    prisma.dispute.findMany({
      where: { merchantId },
      select: { disputeAmount: true, status: true },
    }),
    prisma.auditLog.findMany({
      where: { dispute: { merchantId } },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.aiAnalysis.findMany({
      where: { dispute: { merchantId }, status: 'COMPLETED' },
      select: { completenessScore: true },
    }),
  ]);

  const totalDisputedAmount = disputesList.reduce(
    (sum, d) => sum + Number(d.disputeAmount),
    0
  );

  const avgCompleteness =
    analyses.length > 0
      ? Math.round(
          analyses.reduce((sum, a) => sum + (a.completenessScore || 0), 0) /
            analyses.length
        )
      : 84;

  return res.json({
    success: true,
    data: {
      kpis: {
        totalDisputes,
        activeDisputes,
        urgentDisputes,
        resolvedDisputes,
        totalDisputedAmount,
        averageCompletenessScore: avgCompleteness,
      },
      recentActivity: recentAuditLogs,
    },
  });
}
