import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/db.js';
import { env } from '../config/env.js';
import { AppError, UnauthorizedError, ConflictError } from '../utils/errors.js';
import { auditService } from '../services/audit.service.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';

export async function register(req: Request, res: Response) {
  const { email, password, name, businessName } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError('A user with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'MERCHANT',
      },
    });

    const merchant = await tx.merchant.create({
      data: {
        userId: user.id,
        businessName: businessName || `${name}'s Store`,
        businessEmail: email,
      },
    });

    return { user, merchant };
  });

  const token = jwt.sign(
    { id: result.user.id, email: result.user.email, role: result.user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );

  await auditService.log({
    action: 'USER_LOGIN',
    userId: result.user.id,
    details: { event: 'registration' },
  });

  return res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        merchantId: result.merchant.id,
      },
    },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { merchant: true },
  });

  if (!user || !user.isActive) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );

  await auditService.log({
    action: 'USER_LOGIN',
    userId: user.id,
  });

  return res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        merchantId: user.merchant?.id,
      },
    },
  });
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      lastLoginAt: true,
      merchant: {
        select: {
          id: true,
          businessName: true,
          businessEmail: true,
          paypalConnection: {
            select: { isActive: true, paypalMerchantId: true, connectedAt: true },
          },
        },
      },
    },
  });

  return res.json({ success: true, data: user });
}

export async function logout(req: AuthenticatedRequest, res: Response) {
  if (req.user) {
    await auditService.log({
      action: 'USER_LOGOUT',
      userId: req.user.id,
    });
  }
  return res.json({ success: true, message: 'Logged out successfully' });
}
