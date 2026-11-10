import type { Response } from 'express';
import { disputeService } from '../services/dispute.service.js';
import { auditService } from '../services/audit.service.js';
import { prisma } from '../utils/db.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { EvidenceType } from '@prisma/client';

export async function listDisputes(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant not found');

  const { status, reason, search, page, limit } = req.query;

  const result = await disputeService.listDisputes({
    merchantId,
    status: status as any,
    reason: reason as any,
    search: search ? String(search) : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  return res.json({ success: true, ...result });
}

export async function getDispute(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant not found');

  const id = String(req.params.id);
  const dispute = await disputeService.getDisputeDetails(id, merchantId);

  return res.json({ success: true, data: dispute });
}

export async function syncDispute(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant not found');

  const id = String(req.params.id);
  const dispute = await prisma.dispute.findFirst({
    where: { id, merchantId },
  });

  if (!dispute) throw new NotFoundError('Dispute not found');

  const synced = await disputeService.syncDisputeFromPayPal(
    dispute.paypalDisputeId,
    merchantId,
    req.user?.id
  );

  return res.json({ success: true, data: synced });
}

export async function analyzeDispute(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant not found');

  const id = String(req.params.id);
  const analysis = await disputeService.triggerAiAnalysis(id, merchantId, req.user!.id);

  return res.json({ success: true, data: analysis });
}

export async function attachEvidence(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant not found');

  const id = String(req.params.id);
  const { evidenceType, title, description, sourceReference, sourceData } = req.body;

  const dispute = await prisma.dispute.findFirst({
    where: { id, merchantId },
  });
  if (!dispute) throw new NotFoundError('Dispute not found');

  const evidence = await prisma.disputeEvidence.create({
    data: {
      disputeId: id,
      evidenceType: evidenceType as EvidenceType,
      title,
      description,
      sourceReference,
      sourceData: sourceData || {},
      isVerified: true,
    },
  });

  await auditService.log({
    action: 'EVIDENCE_ATTACHED',
    userId: req.user?.id,
    disputeId: id,
    details: { evidenceId: evidence.id, title },
  });

  return res.status(201).json({ success: true, data: evidence });
}

export async function removeEvidence(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant not found');

  const id = String(req.params.id);
  const evidenceId = String(req.params.evidenceId);

  await prisma.disputeEvidence.deleteMany({
    where: { id: evidenceId, disputeId: id },
  });

  await auditService.log({
    action: 'EVIDENCE_REMOVED',
    userId: req.user?.id,
    disputeId: id,
    details: { evidenceId },
  });

  return res.json({ success: true, message: 'Evidence removed successfully' });
}

export async function updateResponseDraft(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant not found');

  const id = String(req.params.id);
  const result = await disputeService.updateResponseDraft(id, merchantId, req.user!.id, req.body);

  return res.json(result);
}

export async function approveResponse(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant not found');

  const id = String(req.params.id);
  const approved = await disputeService.approveResponse(id, merchantId, req.user!.id);

  return res.json({ success: true, data: approved });
}

export async function rejectResponse(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant not found');

  const id = String(req.params.id);
  const rejected = await disputeService.rejectResponse(id, merchantId, req.user!.id, req.body.reason);

  return res.json({ success: true, data: rejected });
}

export async function submitDispute(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant not found');

  const id = String(req.params.id);
  const submitted = await disputeService.submitToPayPal(id, merchantId, req.user!.id);

  return res.json({ success: true, data: submitted });
}
