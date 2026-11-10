import type { Response } from 'express';
import { prisma } from '../utils/db.js';
import { NotFoundError } from '../utils/errors.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';

export async function getAnalysesForDispute(req: AuthenticatedRequest, res: Response) {
  const disputeId = String(req.params.disputeId);

  const analyses = await prisma.aiAnalysis.findMany({
    where: { disputeId },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({ success: true, data: analyses });
}

export async function getLatestAnalysis(req: AuthenticatedRequest, res: Response) {
  const disputeId = String(req.params.disputeId);

  const analysis = await prisma.aiAnalysis.findFirst({
    where: { disputeId, status: 'COMPLETED' },
    orderBy: { createdAt: 'desc' },
  });

  if (!analysis) {
    throw new NotFoundError('No completed analysis found for this dispute');
  }

  return res.json({ success: true, data: analysis });
}
