import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    logger.warn(
      {
        err,
        statusCode: err.statusCode,
        path: req.path,
        method: req.method,
      },
      err.message
    );

    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        ...(err instanceof AppError && 'errors' in err ? { errors: (err as unknown as { errors: unknown }).errors } : {}),
      },
    });
  }

  // Unhandled / Internal Server Error
  logger.error(
    {
      err,
      path: req.path,
      method: req.method,
      stack: err.stack,
    },
    'Unhandled server error'
  );

  return res.status(500).json({
    success: false,
    error: {
      message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
      ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    },
  });
}
