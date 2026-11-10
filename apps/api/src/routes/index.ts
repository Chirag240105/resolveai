import { Router } from 'express';
import authRoutes from './auth.routes.js';
import merchantRoutes from './merchant.routes.js';
import paypalRoutes from './paypal.routes.js';
import disputeRoutes from './dispute.routes.js';
import analysisRoutes from './analysis.routes.js';
import auditRoutes from './audit.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/merchants', merchantRoutes);
router.use('/paypal', paypalRoutes);
router.use('/disputes', disputeRoutes);
router.use('/analyses', analysisRoutes);
router.use('/audit', auditRoutes);

export default router;

