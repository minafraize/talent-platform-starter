import type {
  FastifyInstance,
  FastifyRequest,
} from "fastify";

import { z } from "zod";

import {
  ACCOUNT_TYPES,
} from "@talent/contracts";

import {
  AppErrors,
  ErrorCode,
} from "@talent/errors";

import {
  JoseTokenVerifier,
} from "@talent/auth";

import type {
  UpgradeAccountUseCase,
} from "../../application/use-cases/upgrade-account.js";

import {
  hashIp,
} from "../../infrastructure/security/ip-hash.js";

interface AccountRoutesOptions {
  upgradeAccount: UpgradeAccountUseCase;
}

interface AuthenticatedRequest
  extends FastifyRequest {
  user?: {
    userId: string;
    sessionId: string;
  };
}

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

  const parts =
    authorization
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

async function authenticate(
  request: AuthenticatedRequest,
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

const upgradeAccountSchema =
  z
    .object({
      targetAccountType:
        z.enum(ACCOUNT_TYPES),
    })
    .strict();

export async function accountRoutes(
  fastify: FastifyInstance,
  options: AccountRoutesOptions,
): Promise<void> {
  fastify.post<{
    Body: unknown;
  }>(
    "/upgrade",
    {
      preHandler: async (
        request,
      ) => {
        await authenticate(
          request as AuthenticatedRequest,
        );
      },
    },
    async (
      request,
      reply,
    ) => {
      const authenticatedRequest =
        request as AuthenticatedRequest;

      const userId =
        authenticatedRequest.user?.userId;

      if (!userId) {
        throw AppErrors.unauthorized(
          ErrorCode.UNAUTHORIZED,
          "Authentication is required",
        );
      }

      const parsed =
        upgradeAccountSchema.safeParse(
          request.body,
        );

      if (!parsed.success) {
        return reply
          .code(400)
          .send({
            success: false,
            error: {
              code:
                ErrorCode.VALIDATION_ERROR,
              message:
                "Invalid account upgrade data",
              details:
                parsed.error.flatten(),
              requestId:
                request.id,
            },
          });
      }

      const userAgentHeader =
        request.headers["user-agent"];

      const userAgent =
        Array.isArray(userAgentHeader)
          ? userAgentHeader.join(", ")
          : userAgentHeader;

      const result =
        await options.upgradeAccount.execute({
          userId,

          targetAccountType:
            parsed.data.targetAccountType,

          ipHash:
            hashIp(request.ip),

          ...(userAgent !== undefined
            ? {
                userAgent,
              }
            : {}),
        });

      return reply
        .code(200)
        .send({
          success: true,
          data: result,
        });
    },
  );
}