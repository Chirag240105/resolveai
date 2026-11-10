import { Router } from 'express';
import { z } from 'zod';
import * as disputeController from '../controllers/dispute.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/errors.js';

const router = Router();

router.use(authenticate);

const evidenceSchema = z.object({
  evidenceType: z.enum([
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
  title: z.string().min(2),
  description: z.string().optional(),
  sourceReference: z.string().optional(),
  sourceData: z.record(z.string(), z.unknown()).optional(),
});

router.get('/', asyncHandler(disputeController.listDisputes));
router.get('/:id', asyncHandler(disputeController.getDispute));
router.post('/:id/sync', asyncHandler(disputeController.syncDispute));
router.post('/:id/analyze', asyncHandler(disputeController.analyzeDispute));
router.post('/:id/evidence', validate({ body: evidenceSchema }), asyncHandler(disputeController.attachEvidence));
router.delete('/:id/evidence/:evidenceId', asyncHandler(disputeController.removeEvidence));
router.put('/:id/response', asyncHandler(disputeController.updateResponseDraft));
router.post('/:id/approve', asyncHandler(disputeController.approveResponse));
router.post('/:id/reject', asyncHandler(disputeController.rejectResponse));
router.post('/:id/submit', asyncHandler(disputeController.submitDispute));

export default router;

