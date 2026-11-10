import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { logger } from "./logger.js";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
    public readonly code = "INTERNAL_SERVER_ERROR",
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new AppError("Route not found", 404, "NOT_FOUND"));
};

export const errorHandler: ErrorRequestHandler = (error: unknown, req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: error.issues.map(({ path, message }) => ({ path: path.join("."), message })),
      },
    });
    return;
  }

  if (isObjectWithString(error, "type") && error.type === "entity.parse.failed") {
    res.status(400).json({ error: { code: "INVALID_JSON", message: "Request body contains invalid JSON" } });
    return;
  }
  if (isObjectWithString(error, "name") && error.name === "MulterError") {
    const tooLarge = isObjectWithString(error, "code") && error.code === "LIMIT_FILE_SIZE";
    res.status(tooLarge ? 413 : 400).json({
      error: { code: tooLarge ? "DOCUMENT_TOO_LARGE" : "INVALID_UPLOAD", message: tooLarge ? "Document exceeds the upload size limit" : "Invalid document upload" },
    });
    return;
  }

  const knownError = error instanceof AppError ? error : undefined;
  const prismaCode = isObjectWithString(error, "code") ? error.code : undefined;
  const databaseConflict = prismaCode === "P2002";
  const missingRecord = prismaCode === "P2025";
  const statusCode = knownError?.statusCode ?? (databaseConflict ? 409 : missingRecord ? 404 : 500);
  const code = knownError?.code ?? (databaseConflict ? "CONFLICT" : missingRecord ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR");
  const message = knownError?.message ?? (databaseConflict ? "A record with these values already exists" : missingRecord ? "The requested record was not found" : "An unexpected error occurred");

  if (statusCode >= 500) {
    logger.error({ err: error, requestId: req.id }, "Request failed");
  } else {
    logger.warn({ statusCode, code, requestId: req.id }, "Request rejected");
  }

  res.status(statusCode).json({ error: { code, message } });
};

function isObjectWithString(value: unknown, key: string): value is Record<string, string> {
  return typeof value === "object" && value !== null && key in value && typeof (value as Record<string, unknown>)[key] === "string";
}
