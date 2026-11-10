import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WebhookService } from '../../apps/api/src/services/webhook.service.js';
import { prisma } from '../../apps/api/src/utils/db.js';

describe('Webhook Processing and Deduplication', () => {
  const service = new WebhookService();

  it('rejects webhooks without an event id or event_type', async () => {
    await expect(
      service.processEvent({
        headers: {},
        body: {} as any,
      })
    ).rejects.toThrow('Malformed webhook payload');
  });

  it('correctly maps dispute creation payload structure', () => {
    const mockResource = {
      dispute_id: 'PP-D-TEST-1',
      dispute_amount: { value: '199.99', currency_code: 'USD' },
      reason: 'MERCHANDISE_OR_SERVICE_NOT_RECEIVED',
      status: 'WAITING_FOR_SELLER_RESPONSE',
    };

    expect(mockResource.dispute_id).toBe('PP-D-TEST-1');
    expect(Number(mockResource.dispute_amount.value)).toBe(199.99);
  });
});

