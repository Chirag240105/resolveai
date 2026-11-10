import { Router } from 'express';
import { z } from 'zod';
import * as paypalController from '../controllers/paypal.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/errors.js';

const router = Router();

// Webhook endpoint does NOT require merchant JWT authentication
router.post('/webhooks', asyncHandler(paypalController.handleWebhook));

// Authenticated routes
const connectSchema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  paypalMerchantId: z.string().optional(),
});

const createOrderSchema = z.object({
  amount: z.union([z.string(), z.number()]),
  currency: z.string().length(3).optional(),
  description: z.string().optional(),
});

router.post('/connect', authenticate, validate({ body: connectSchema }), asyncHandler(paypalController.connectPayPal));
router.get('/status', authenticate, asyncHandler(paypalController.getPayPalStatus));
router.post('/disconnect', authenticate, asyncHandler(paypalController.disconnectPayPal));
router.post('/orders', authenticate, validate({ body: createOrderSchema }), asyncHandler(paypalController.createOrder));
router.post('/orders/:orderId/capture', authenticate, asyncHandler(paypalController.captureOrder));

export default router;

