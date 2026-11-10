import { Router } from 'express';
import { z } from 'zod';
import * as merchantController from '../controllers/merchant.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/errors.js';

const router = Router();

router.use(authenticate);

const updateProfileSchema = z.object({
  businessName: z.string().min(2).optional(),
  businessEmail: z.string().email().optional(),
});

router.get('/me', asyncHandler(merchantController.getProfile));
router.put('/me', validate({ body: updateProfileSchema }), asyncHandler(merchantController.updateProfile));
router.get('/dashboard', asyncHandler(merchantController.getDashboardKpis));

export default router;
