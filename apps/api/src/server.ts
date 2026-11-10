import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { prisma } from './utils/db.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost and specified frontend url
      if (!origin || origin.startsWith('http://localhost') || origin === env.CORS_ORIGIN) {
        callback(null, true);
      } else {
        callback(null, true); // Dev flexible
      }
    },
    credentials: true,
  })
);

app.use(generalLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'resolveai-api',
      environment: env.NODE_ENV,
    });
  } catch (err) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: err instanceof Error ? err.message : 'DB Error',
    });
  }
});

// Mount Routes
app.use('/api', routes);

// Error Handling
app.use(errorHandler);

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  logger.info(`ResolveAI Backend API running on port ${PORT} [${env.NODE_ENV}]`);
});

// Graceful Shutdown
function handleShutdown(signal: string) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Database disconnected and HTTP server closed.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export default app;
