import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../apps/api/src/utils/db.js';
import * as authController from '../../apps/api/src/controllers/auth.controller.js';
import { env } from '../../apps/api/src/config/env.js';

describe('ResolveAI Authentication & Onboarding Integration Tests', () => {
  const testEmail = `test-merchant-${Date.now()}@resolveai.test`;
  const testPassword = 'SecurePassword123!';
  const testName = 'Jane Doe';
  const testBusiness = 'Jane Premium Store';
  let createdUserId: string;

  afterAll(async () => {
    if (createdUserId) {
      await prisma.auditLog.deleteMany({ where: { userId: createdUserId } }).catch(() => {});
      await prisma.merchant.deleteMany({ where: { userId: createdUserId } }).catch(() => {});
      await prisma.user.delete({ where: { id: createdUserId } }).catch(() => {});
    }
  });

  // Mock Express Response helper
  function createMockResponse() {
    const res: any = {
      statusCode: 200,
      jsonData: null,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(data: any) {
        this.jsonData = data;
        return this;
      },
    };
    return res;
  }

  it('registers a new merchant user successfully with encrypted password', async () => {
    const req: any = {
      body: {
        email: testEmail,
        password: testPassword,
        name: testName,
        businessName: testBusiness,
      },
    };
    const res = createMockResponse();

    await authController.register(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.jsonData.success).toBe(true);
    expect(res.jsonData.data.token).toBeDefined();
    expect(res.jsonData.data.user.email).toBe(testEmail);
    expect(res.jsonData.data.user.name).toBe(testName);
    expect(res.jsonData.data.user.merchantId).toBeDefined();

    createdUserId = res.jsonData.data.user.id;

    // Verify database persistence and password encryption
    const dbUser = await prisma.user.findUnique({
      where: { id: createdUserId },
      include: { merchant: true },
    });

    expect(dbUser).not.toBeNull();
    expect(dbUser!.passwordHash).not.toBe(testPassword); // Never plaintext
    const isValidHash = await bcrypt.compare(testPassword, dbUser!.passwordHash);
    expect(isValidHash).toBe(true);

    // Verify linked merchant entity
    expect(dbUser!.merchant).not.toBeNull();
    expect(dbUser!.merchant!.businessName).toBe(testBusiness);
  });

  it('rejects registration with duplicate email with 409 Conflict', async () => {
    const req: any = {
      body: {
        email: testEmail,
        password: 'AnotherPassword123!',
        name: 'Another Name',
      },
    };
    const res = createMockResponse();

    await expect(authController.register(req, res)).rejects.toThrow(
      /A user with this email already exists/
    );
  });

  it('authenticates valid credentials and issues valid JWT token', async () => {
    const req: any = {
      body: {
        email: testEmail,
        password: testPassword,
      },
    };
    const res = createMockResponse();

    await authController.login(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.jsonData.success).toBe(true);
    expect(res.jsonData.data.token).toBeDefined();

    // Verify JWT payload
    const decoded: any = jwt.verify(res.jsonData.data.token, env.JWT_SECRET);
    expect(decoded.email).toBe(testEmail);
    expect(decoded.id).toBe(createdUserId);
  });

  it('rejects login with incorrect password with 401 Unauthorized', async () => {
    const req: any = {
      body: {
        email: testEmail,
        password: 'WrongPassword999!',
      },
    };
    const res = createMockResponse();

    await expect(authController.login(req, res)).rejects.toThrow(
      /Invalid email or password/
    );
  });

  it('rejects login with non-existent email with 401 Unauthorized', async () => {
    const req: any = {
      body: {
        email: `non-existent-${Date.now()}@resolveai.test`,
        password: 'SomePassword123!',
      },
    };
    const res = createMockResponse();

    await expect(authController.login(req, res)).rejects.toThrow(
      /Invalid email or password/
    );
  });

  it('allows authenticated user to fetch their profile via getMe', async () => {
    const req: any = {
      user: {
        id: createdUserId,
        email: testEmail,
        role: 'MERCHANT',
      },
    };
    const res = createMockResponse();

    await authController.getMe(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.jsonData.success).toBe(true);
    expect(res.jsonData.data.id).toBe(createdUserId);
    expect(res.jsonData.data.email).toBe(testEmail);
    expect(res.jsonData.data.merchant.businessName).toBe(testBusiness);
  });

  it('logs user logout action to audit trail', async () => {
    const req: any = {
      user: {
        id: createdUserId,
        email: testEmail,
        role: 'MERCHANT',
      },
    };
    const res = createMockResponse();

    await authController.logout(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.jsonData.success).toBe(true);
    expect(res.jsonData.message).toBe('Logged out successfully');

    // Verify audit log entry in database
    const auditRecord = await prisma.auditLog.findFirst({
      where: {
        userId: createdUserId,
        action: 'USER_LOGOUT',
      },
    });
    expect(auditRecord).not.toBeNull();
  });
});

