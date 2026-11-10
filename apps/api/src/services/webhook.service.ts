import { prisma } from '../utils/db.js';
import { logger } from '../utils/logger.js';
import { auditService } from './audit.service.js';
import { disputeService } from './dispute.service.js';
import { paypalClient } from '../paypal/client.js';
import { env } from '../config/env.js';
import type { DisputeStatus, DisputeOutcome } from '@prisma/client';

export interface RawWebhookRequest {
  headers: Record<string, string | string[] | undefined>;
  body: Record<string, unknown>;
}

export class WebhookService {
  async processEvent(raw: RawWebhookRequest) {
    const payload = raw.body as any;
    const eventId = payload.id;
    const eventType = payload.event_type;

    if (!eventId || !eventType) {
      throw new Error('Malformed webhook payload: missing id or event_type');
    }

    // 1. Signature Verification (bypassed in test/mock mode if configured)
    if (!env.DEMO_MODE && env.PAYPAL_WEBHOOK_ID) {
      const authAlgo = String(raw.headers['paypal-auth-algo'] || '');
      const certUrl = String(raw.headers['paypal-cert-url'] || '');
      const transmissionId = String(raw.headers['paypal-transmission-id'] || '');
      const transmissionSig = String(raw.headers['paypal-transmission-sig'] || '');
      const transmissionTime = String(raw.headers['paypal-transmission-time'] || '');

      const isVerified = await paypalClient.verifyWebhookSignature({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: env.PAYPAL_WEBHOOK_ID,
        webhook_event: payload,
      });

      if (!isVerified) {
        logger.warn({ eventId, eventType }, 'Webhook signature verification failed');
        throw new Error('Invalid PayPal webhook signature');
      }
    }

    // 2. Deduplication Check
    const existing = await prisma.webhookEvent.findUnique({
      where: { paypalEventId: eventId },
    });

    if (existing) {
      logger.info({ eventId }, 'Duplicate webhook event received; skipping');
      return { status: 'DUPLICATE', eventId };
    }

    // 3. Record Webhook in DB
    const eventRecord = await prisma.webhookEvent.create({
      data: {
        paypalEventId: eventId,
        eventType,
        resourceType: payload.resource_type,
        resourceId: payload.resource?.id,
        payload: payload as object,
        status: 'PROCESSING',
      },
    });

    await auditService.log({
      action: 'WEBHOOK_RECEIVED',
      details: { eventId, eventType },
    });

    try {
      await this.dispatch(eventType, payload.resource);

      await prisma.webhookEvent.update({
        where: { id: eventRecord.id },
        data: {
          status: 'PROCESSED',
          processedAt: new Date(),
        },
      });

      await auditService.log({
        action: 'WEBHOOK_PROCESSED',
        details: { eventId, eventType },
      });

      return { status: 'PROCESSED', eventId };
    } catch (err) {
      logger.error({ err, eventId, eventType }, 'Webhook processing failed');

      await prisma.webhookEvent.update({
        where: { id: eventRecord.id },
        data: {
          status: 'FAILED',
          errorMessage: err instanceof Error ? err.message : 'Unknown processing error',
        },
      });

      await auditService.log({
        action: 'WEBHOOK_FAILED',
        details: { eventId, error: err instanceof Error ? err.message : 'Unknown' },
      });

      throw err;
    }
  }

  private async dispatch(eventType: string, resource: any) {
    if (!resource) return;

    // Default merchant fallback for development
    const defaultMerchant = await prisma.merchant.findFirst();
    const merchantId = defaultMerchant?.id;

    if (!merchantId) {
      logger.warn('No registered merchant in system to assign webhook event to');
      return;
    }

    switch (eventType) {
      case 'CUSTOMER.DISPUTE.CREATED':
      case 'CUSTOMER.DISPUTE.UPDATED': {
        const disputeId = resource.dispute_id || resource.id;
        if (disputeId) {
          await disputeService.syncDisputeFromPayPal(disputeId, merchantId);
        }
        break;
      }

      case 'CUSTOMER.DISPUTE.RESOLVED': {
        const disputeId = resource.dispute_id || resource.id;
        if (disputeId) {
          const outcomeMap: Record<string, DisputeOutcome> = {
            RESOLVED_BUYER_FAVOUR: 'RESOLVED_BUYER_FAVOUR',
            RESOLVED_SELLER_FAVOUR: 'RESOLVED_SELLER_FAVOUR',
            RESOLVED_WITH_PAYOUT: 'RESOLVED_WITH_PAYOUT',
            CANCELED_BY_BUYER: 'CANCELED_BY_BUYER',
          };

          await prisma.dispute.updateMany({
            where: { paypalDisputeId: disputeId },
            data: {
              status: 'RESOLVED',
              outcome: outcomeMap[resource.dispute_outcome?.outcome_code] || 'NONE',
            },
          });
        }
        break;
      }

      case 'PAYMENT.CAPTURE.COMPLETED': {
        const captureId = resource.id;
        const amount = resource.amount?.value || '0.00';
        const currency = resource.amount?.currency_code || 'USD';

        await prisma.transaction.upsert({
          where: { paypalCaptureId: captureId },
          update: {
            status: 'COMPLETED',
            amount: Number(amount),
            currency,
          },
          create: {
            merchantId,
            paypalCaptureId: captureId,
            amount: Number(amount),
            currency,
            status: 'COMPLETED',
            payerEmail: resource.payer?.email_address,
            payerName: `${resource.payer?.name?.given_name || ''} ${resource.payer?.name?.surname || ''}`.trim(),
            description: resource.note_to_payer || 'PayPal Checkout Payment',
          },
        });
        break;
      }

      default:
        logger.info({ eventType }, 'Ignored unhandled webhook event type');
    }
  }
}

export const webhookService = new WebhookService();

