import { Router } from 'express';
import * as auditController from '../controllers/audit.controller.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(auditController.listAuditLogs));
router.get('/dispute/:disputeId', asyncHandler(auditController.getDisputeAuditTrail));

export default router;

