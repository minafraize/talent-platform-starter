import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";

import {
  AppError,
  ErrorCode,
  type ErrorResponse,
} from "@talent/errors";

function getRetryAfterSeconds(
  details: unknown,
): number | undefined {
  if (
    !details ||
    typeof details !== "object" ||
    !("retryAfterSeconds" in details)
  ) {
    return undefined;
  }

  const value = (
    details as {
      retryAfterSeconds?: unknown;
    }
  ).retryAfterSeconds;

  return typeof value === "number"
    ? Math.max(1, Math.ceil(value))
    : undefined;
}

export function registerErrorHandler(
  app: FastifyInstance,
): void {
  app.setErrorHandler((error, request, reply) => {
    const requestId = request.id;

    if (error instanceof AppError) {
      const response: ErrorResponse = {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details ?? null,
          requestId,
        },
      };

      // Retry-After is part of the HTTP contract for rate-limited requests.
      if (error.code === ErrorCode.RATE_LIMITED) {
        const retryAfterSeconds =
          getRetryAfterSeconds(error.details);

        if (retryAfterSeconds !== undefined) {
          reply.header(
            "Retry-After",
            String(retryAfterSeconds),
          );
        }
      }

      // Expected client errors should not pollute error logs.
      if (error.statusCode >= 500) {
        request.log.error(
          {
            err: error,
            requestId,
          },
          "Request failed",
        );
      } else {
        request.log.warn(
          {
            code: error.code,
            statusCode: error.statusCode,
            requestId,
          },
          "Client request rejected",
        );
      }

      return reply
        .status(error.statusCode)
        .send(response);
    }

    if (error instanceof ZodError) {
      const response: ErrorResponse = {
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: "Request validation failed",
          details: error.issues,
          requestId,
        },
      };

      request.log.warn(
        {
          code: ErrorCode.VALIDATION_ERROR,
          statusCode: 400,
          requestId,
        },
        "Client request rejected",
      );

      return reply
        .status(400)
        .send(response);
    }

    // Never expose unknown/internal error details to clients.
    request.log.error(
      {
        err: error,
        requestId,
      },
      "Unhandled request error",
    );

    const response: ErrorResponse = {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "An unexpected error occurred",
        details: null,
        requestId,
      },
    };

    return reply
      .status(500)
      .send(response);
  });
}