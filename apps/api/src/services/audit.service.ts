import { prisma } from '../utils/db.js';
import { logger } from '../utils/logger.js';
import type { AuditAction } from '@prisma/client';

export interface CreateAuditLogParams {
  action: AuditAction;
  userId?: string;
  disputeId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  async log(params: CreateAuditLogParams) {
    try {
      const record = await prisma.auditLog.create({
        data: {
          action: params.action,
          userId: params.userId,
          disputeId: params.disputeId,
          details: (params.details || {}) as object,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
      return record;
    } catch (err) {
      logger.error({ err, params }, 'Failed to create audit log entry');
      return null;
    }
  }

  async getDisputeTrail(disputeId: string) {
    return prisma.auditLog.findMany({
      where: { disputeId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async list(params: { page?: number; limit?: number; action?: AuditAction }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 25));
    const skip = (page - 1) * limit;

    const where = params.action ? { action: params.action } : {};

    const [total, items] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
          dispute: { select: { id: true, paypalDisputeId: true, reason: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const auditService = new AuditService();
