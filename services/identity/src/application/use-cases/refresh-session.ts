import { randomBytes } from "node:crypto";

import type { PrismaClient } from "../../generated/prisma/index.js";

import {
  AppErrors,
  ErrorCode,
} from "@talent/errors";

import type { TokenService } from "../ports/token-service.js";

import {
  hashToken,
} from "../../infrastructure/security/token-hash.js";

export interface RefreshSessionInput {
  refreshToken: string;
}

export interface RefreshSessionOutput {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export class RefreshSessionUseCase {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly tokenService: TokenService,
  ) {}

async execute(
  input: RefreshSessionInput,
): Promise<RefreshSessionOutput> {
  const oldTokenHash = hashToken(
    input.refreshToken,
  );

  const session =
    await this.prisma.session.findUnique({
      where: {
        tokenHash: oldTokenHash,
      },
    });

  if (!session) {
    throw AppErrors.unauthorized(
      ErrorCode.UNAUTHORIZED,
      "Invalid refresh token",
    );
  }

  const now = new Date();

  if (
    session.status !== "ACTIVE" ||
    session.expiresAt <= now
  ) {
    throw AppErrors.unauthorized(
      ErrorCode.UNAUTHORIZED,
      "Invalid refresh token",
    );
  }

  const newRefreshToken =
    randomBytes(32).toString("base64url");

  const newRefreshTokenHash =
    hashToken(newRefreshToken);

  const refreshTokenTtlDays = Number(
    process.env.REFRESH_TOKEN_TTL_DAYS ?? 30,
  );

  const expiresAt = new Date(
    Date.now() +
      refreshTokenTtlDays *
        24 *
        60 *
        60 *
        1000,
  );

  const rotationResult =
    await this.prisma.$transaction(
      async (tx) => {
        const result =
          await tx.session.updateMany({
            where: {
              id: session.id,
              tokenHash: oldTokenHash,
              status: "ACTIVE",
              expiresAt: {
                gt: now,
              },
            },
            data: {
              tokenHash: newRefreshTokenHash,
              expiresAt,
            },
          });

        return result;
      },
    );

  if (rotationResult.count !== 1) {
    throw AppErrors.unauthorized(
      ErrorCode.UNAUTHORIZED,
      "Invalid refresh token",
    );
  }

  const accessToken =
    await this.tokenService.createAccessToken({
      userId: session.userId,
      sessionId: session.id,
    });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    expiresAt,
  };
}
}