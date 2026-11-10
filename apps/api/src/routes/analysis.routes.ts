import { Router } from 'express';
import * as analysisController from '../controllers/analysis.controller.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';

const router = Router();

router.use(authenticate);

router.get('/:disputeId', asyncHandler(analysisController.getAnalysesForDispute));
router.get('/:disputeId/latest', asyncHandler(analysisController.getLatestAnalysis));

export default router;

