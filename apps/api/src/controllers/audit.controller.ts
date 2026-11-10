import type { Response } from 'express';
import { auditService } from '../services/audit.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';

export async function listAuditLogs(req: AuthenticatedRequest, res: Response) {
  const { page, limit, action } = req.query;

  const result = await auditService.list({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    action: action as any,
  });

  return res.json({ success: true, ...result });
}

export async function getDisputeAuditTrail(req: AuthenticatedRequest, res: Response) {
  const disputeId = String(req.params.disputeId);
  const trail = await auditService.getDisputeTrail(disputeId);

  return res.json({ success: true, data: trail });
}
