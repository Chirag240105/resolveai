import { Router } from 'express';
import { z } from 'zod';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../utils/errors.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2),
  businessName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post(
  '/register',
  authLimiter,
  validate({ body: registerSchema }),
  asyncHandler(authController.register)
);

router.post(
  '/login',
  authLimiter,
  validate({ body: loginSchema }),
  asyncHandler(authController.login)
);

router.get('/me', authenticate, asyncHandler(authController.getMe));
router.post('/logout', authenticate, asyncHandler(authController.logout));

export default router;
