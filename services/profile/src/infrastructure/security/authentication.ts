import type { FastifyRequest } from "fastify";

import {
  AppErrors,
  ErrorCode,
} from "@talent/errors";

import {
  JoseTokenVerifier,
} from "@talent/auth";

export type {
  AccessTokenPayload as AuthenticatedUser,
} from "@talent/auth";

const tokenVerifier =
  new JoseTokenVerifier();

function extractBearerToken(
  authorization: string | undefined,
): string {
  if (!authorization) {
    throw AppErrors.unauthorized(
      ErrorCode.UNAUTHORIZED,
      "Authorization header is required",
    );
  }

  const parts = authorization
    .trim()
    .split(/\s+/);

  if (
    parts.length !== 2 ||
    parts[0] !== "Bearer" ||
    !parts[1]
  ) {
    throw AppErrors.unauthorized(
      ErrorCode.UNAUTHORIZED,
      "Invalid authorization header",
    );
  }

  return parts[1];
}

export async function authenticate(
  request: FastifyRequest,
): Promise<void> {
  const token =
    extractBearerToken(
      request.headers.authorization,
    );

  try {
    request.user =
      await tokenVerifier.verifyAccessToken(
        token,
      );
  } catch {
    throw AppErrors.unauthorized(
      ErrorCode.UNAUTHORIZED,
      "Invalid access token",
    );
  }
}