import { prisma } from '../utils/db.js';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
  execute: (args: Record<string, unknown>) => Promise<unknown>;
}

export const tools: Record<string, ToolDefinition> = {
  getTransactionDetails: {
    name: 'getTransactionDetails',
    description: 'Retrieves complete transaction records including buyer details, shipping address, and line items.',
    parameters: {
      type: 'object',
      properties: {
        transactionId: {
          type: 'string',
          description: 'The internal ID or PayPal transaction/order/capture ID',
        },
      },
      required: ['transactionId'],
    },
    execute: async (args: Record<string, unknown>) => {
      const id = String(args.transactionId);
      const tx = await prisma.transaction.findFirst({
        where: {
          OR: [
            { id },
            { paypalOrderId: id },
            { paypalTransactionId: id },
            { paypalCaptureId: id },
          ],
        },
      });
      return tx || { error: 'Transaction not found' };
    },
  },

  getShippingInfo: {
    name: 'getShippingInfo',
    description: 'Retrieves tracking and shipment verification data for a given transaction or dispute.',
    parameters: {
      type: 'object',
      properties: {
        transactionId: {
          type: 'string',
          description: 'Transaction ID for lookup',
        },
      },
      required: ['transactionId'],
    },
    execute: async (args: Record<string, unknown>) => {
      const tx = await prisma.transaction.findUnique({
        where: { id: String(args.transactionId) },
        select: {
          trackingInfo: true,
          shippingAddress: true,
          status: true,
          createdAt: true,
        },
      });
      return tx || { error: 'Shipping details not found' };
    },
  },

  getOrderHistory: {
    name: 'getOrderHistory',
    description: 'Retrieves prior transactions by the same buyer email to demonstrate buyer relationship history.',
    parameters: {
      type: 'object',
      properties: {
        buyerEmail: {
          type: 'string',
          description: 'Buyer email address',
        },
      },
      required: ['buyerEmail'],
    },
    execute: async (args: Record<string, unknown>) => {
      const history = await prisma.transaction.findMany({
        where: { payerEmail: String(args.buyerEmail) },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          createdAt: true,
        },
      });
      return { totalOrders: history.length, orders: history };
    },
  },
};

