import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://resolveai:password@localhost:5432/resolveai?schema=public',

  JWT_SECRET: process.env.JWT_SECRET || 'resolveai-super-secret-jwt-key-min-32-chars!!',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '12h',

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',

  PAYPAL_BASE_URL: process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com',
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || '',
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || '',
  PAYPAL_WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID || '',

  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  DEMO_MODE: process.env.DEMO_MODE === 'true',
};
