import { ErrorCode } from "./error-codes.js";
import type { ErrorCode as ErrorCodeType } from "./error-codes.js";

export interface AppErrorOptions {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: unknown;
  cause?: unknown;
}

export class AppError extends Error {
  readonly code: ErrorCodeType;
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(options: AppErrorOptions) {
    super(options.message, {
      cause: options.cause,
    });

    this.name = "AppError";
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.details = options.details;
  }
}

export const AppErrors = {
  validation(
    code: ErrorCode,
    message = "Request validation failed",
    details?: unknown,
  ) {
    return new AppError({
      code: code || ErrorCode.VALIDATION_ERROR,
      message,
      statusCode: 400,
      details,
    });
  },

  unauthorized(
    code: ErrorCode,
    message = "Authentication is required",
  ) {
    return new AppError({
      code,
      message,
      statusCode: 401,
    });
  },

  forbidden(
    message = "You do not have permission to perform this action",
  ) {
    return new AppError({
      code: ErrorCode.FORBIDDEN,
      message,
      statusCode: 403,
    });
  },

  notFound(
    code: ErrorCode,
    message = "Resource not found",
  ) {
    return new AppError({
      code,
      message,
      statusCode: 404,
    });
  },

  conflict(
    code: ErrorCode,
    message: string,
  ) {
    return new AppError({
      code,
      message,
      statusCode: 409,
    });
  },

  internal(
    message = "An unexpected error occurred",
    cause?: unknown,
  ) {
    return new AppError({
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message,
      statusCode: 500,
      cause,
    });
  },

  unavailable(
    message = "Service is temporarily unavailable",
    cause?: unknown,
  ) {
    return new AppError({
      code: ErrorCode.SERVICE_UNAVAILABLE,
      message,
      statusCode: 503,
      cause,
    });
  },

  rateLimited(
    code: ErrorCode,
    message: string,
    details: unknown = null,
  ) {
    return new AppError({
      code,
      message,
      statusCode: 429,
      details,
    });
  },
};