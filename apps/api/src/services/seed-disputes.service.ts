import { prisma } from '../utils/db.js';
import type { DisputeReason } from '@prisma/client';

export async function generateDemoDisputes(merchantId: string) {
  const sampleDisputes = [
    {
      paypalDisputeId: 'PP-D-89211',
      reason: 'ITEM_NOT_RECEIVED' as DisputeReason,
      disputeAmount: 189.99,
      disputeCurrency: 'USD',
      sellerResponseDueDate: new Date(Date.now() + 86400000 * 2), // 2 days
      orderRef: 'ORD-77491-US',
      carrier: 'USPS',
      trackingNumber: '9400111899562537829102',
      trackingStatus: 'DELIVERED',
      itemTitle: 'UltraClean Smart HEPA Air Purifier',
      buyerEmail: 'sarah.connor@example.com',
      buyerName: 'Sarah Connor',
    },
    {
      paypalDisputeId: 'PP-D-89212',
      reason: 'UNAUTHORIZED_TRANSACTION' as DisputeReason,
      disputeAmount: 549.0,
      disputeCurrency: 'USD',
      sellerResponseDueDate: new Date(Date.now() + 86400000 * 4), // 4 days
      orderRef: 'ORD-77492-US',
      carrier: 'FedEx',
      trackingNumber: '782910384719',
      trackingStatus: 'DELIVERED',
      itemTitle: 'Sony WH-1000XM5 Noise Canceling Headphones',
      buyerEmail: 'alex.rivera@example.com',
      buyerName: 'Alex Rivera',
    },
    {
      paypalDisputeId: 'PP-D-89213',
      reason: 'ITEM_NOT_AS_DESCRIBED' as DisputeReason,
      disputeAmount: 79.5,
      disputeCurrency: 'USD',
      sellerResponseDueDate: new Date(Date.now() + 86400000 * 1), // 1 day - URGENT
      orderRef: 'ORD-77493-US',
      carrier: 'UPS',
      trackingNumber: '1Z9999999999999999',
      trackingStatus: 'DELIVERED',
      itemTitle: 'Mechanical Gaming Keyboard RGB',
      buyerEmail: 'marcus.vance@example.com',
      buyerName: 'Marcus Vance',
    },
    {
      paypalDisputeId: 'PP-D-89214',
      reason: 'DUPLICATE_TRANSACTION' as DisputeReason,
      disputeAmount: 34.0,
      disputeCurrency: 'USD',
      sellerResponseDueDate: new Date(Date.now() + 86400000 * 7),
      orderRef: 'ORD-77494-US',
      carrier: 'USPS',
      trackingNumber: '9400111899562537829999',
      trackingStatus: 'DELIVERED',
      itemTitle: 'USB-C Dual Fast Charging Hub',
      buyerEmail: 'elena.rostova@example.com',
      buyerName: 'Elena Rostova',
    },
  ];

  for (const item of sampleDisputes) {
    // 1. Transaction
    const tx = await prisma.transaction.upsert({
      where: { paypalOrderId: item.orderRef },
      update: {},
      create: {
        merchantId,
        paypalOrderId: item.orderRef,
        paypalCaptureId: `CAP-${item.orderRef}`,
        amount: item.disputeAmount,
        currency: item.disputeCurrency,
        status: 'COMPLETED',
        payerEmail: item.buyerEmail,
        payerName: item.buyerName,
        description: item.itemTitle,
        itemDetails: [{ name: item.itemTitle, quantity: 1, unitAmount: item.disputeAmount }],
        shippingAddress: {
          line1: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'OR',
          postalCode: '97477',
          country: 'US',
        },
        trackingInfo: {
          carrier: item.carrier,
          trackingNumber: item.trackingNumber,
          status: item.trackingStatus,
          dispatchedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          deliveredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      },
    });

    // 2. Dispute
    await prisma.dispute.upsert({
      where: { paypalDisputeId: item.paypalDisputeId },
      update: {},
      create: {
        merchantId,
        transactionId: tx.id,
        paypalDisputeId: item.paypalDisputeId,
        reason: item.reason,
        status: 'WAITING_FOR_SELLER_RESPONSE',
        disputeAmount: item.disputeAmount,
        disputeCurrency: item.disputeCurrency,
        sellerResponseDueDate: item.sellerResponseDueDate,
        approvalStatus: 'PENDING_REVIEW',
        messages: [
          {
            posted_by: 'BUYER',
            time_posted: new Date(Date.now() - 86400000).toISOString(),
            content: `I ordered this item but have not received it yet. Requesting full refund.`,
          },
        ],
      },
    });
  }
}

