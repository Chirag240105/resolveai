import type { Request, Response } from 'express';
import { prisma } from '../utils/db.js';
import { paypalClient } from '../paypal/client.js';
import { webhookService } from '../services/webhook.service.js';
import { auditService } from '../services/audit.service.js';
import { AppError, NotFoundError } from '../utils/errors.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';

export async function connectPayPal(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant profile not found');

  const { paypalMerchantId, clientId, clientSecret } = req.body;

  // Verify connection by attempting to obtain an OAuth token
  const testClient = new (paypalClient.constructor as any)(clientId, clientSecret);
  await testClient.getAccessToken();

  const connection = await prisma.paypalConnection.upsert({
    where: { merchantId },
    update: {
      paypalMerchantId,
      accessToken: clientId, // stored identifier
      isActive: true,
      updatedAt: new Date(),
    },
    create: {
      merchantId,
      paypalMerchantId,
      accessToken: clientId,
      isActive: true,
    },
  });

  await auditService.log({
    action: 'PAYPAL_CONNECTED',
    userId: req.user?.id,
    details: { paypalMerchantId },
  });

  return res.json({ success: true, data: { isConnected: true, connectionId: connection.id } });
}

export async function getPayPalStatus(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant profile not found');

  const connection = await prisma.paypalConnection.findUnique({
    where: { merchantId },
  });

  return res.json({
    success: true,
    data: {
      isConnected: Boolean(connection?.isActive),
      connectedAt: connection?.connectedAt,
      paypalMerchantId: connection?.paypalMerchantId,
    },
  });
}

export async function disconnectPayPal(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant profile not found');

  await prisma.paypalConnection.updateMany({
    where: { merchantId },
    data: { isActive: false },
  });

  await auditService.log({
    action: 'PAYPAL_DISCONNECTED',
    userId: req.user?.id,
  });

  return res.json({ success: true, message: 'PayPal disconnected successfully' });
}

export async function createOrder(req: AuthenticatedRequest, res: Response) {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new NotFoundError('Merchant profile not found');

  const { amount, currency = 'USD', description = 'ResolveAI Sandbox Test Order' } = req.body;

  const order = await paypalClient.createOrder({
    amount: String(amount),
    currency,
    description,
    invoiceId: `INV-${Date.now()}`,
  });

  const tx = await prisma.transaction.create({
    data: {
      merchantId,
      paypalOrderId: order.id,
      amount: Number(amount),
      currency,
      status: order.status,
      description,
      itemDetails: [{ name: description, quantity: 1, amount }],
      shippingAddress: {
        line1: '123 Main St',
        city: 'San Jose',
        state: 'CA',
        postalCode: '95131',
        country: 'US',
      },
    },
  });

  return res.status(201).json({ success: true, data: { order, transaction: tx } });
}

export async function captureOrder(req: AuthenticatedRequest, res: Response) {
  const orderId = String(req.params.orderId);

  const captured = await paypalClient.captureOrder(orderId);
  const captureId = captured.purchase_units?.[0]?.payments?.captures?.[0]?.id;

  if (captureId) {
    await prisma.transaction.updateMany({
      where: { paypalOrderId: orderId },
      data: {
        paypalCaptureId: captureId,
        status: 'COMPLETED',
      },
    });
  }

  return res.json({ success: true, data: captured });
}

export async function handleWebhook(req: Request, res: Response) {
  try {
    const result = await webhookService.processEvent({
      headers: req.headers,
      body: req.body,
    });
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: { message: err instanceof Error ? err.message : 'Webhook error' },
    });
  }
}
