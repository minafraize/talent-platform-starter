import { randomBytes } from "node:crypto";

import type { PrismaClient } from "../../generated/prisma/index.js";

import {
  AppErrors,
  ErrorCode,
} from "@talent/errors";

import type { PasswordHasher } from "../ports/password-hasher.js";
import type { TokenService } from "../ports/token-service.js";

import {
  hashToken,
} from "../../infrastructure/security/token-hash.js";
import { LoginRateLimiter } from "../security/login-rate-limiter.js";

export interface LoginUserInput {
  email: string;
  password: string;
  ipHash: string;
}

export interface LoginUserOutput {
  user: {
    userId: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export class LoginUserUseCase {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
    private readonly loginRateLimiter: LoginRateLimiter,
  ) {}

  async execute(
    input: LoginUserInput,
  ): Promise<LoginUserOutput> {
    const email = input.email.trim().toLowerCase();

    await this.loginRateLimiter.check({
      ipHash: input.ipHash,
      identifier: email,
    });

    const account =
      await this.prisma.account.findUnique({
        where: {
          loginIdentifier: email,
        },
        include: {
          user: true,
        },
      });

    if (
      !account ||
      account.provider !== "LOCAL" ||
      !account.passwordHash
    ) {
      await this.recordFailedLogin();
      throw AppErrors.unauthorized(
        ErrorCode.INVALID_CREDENTIALS,
        "Invalid email or password",
      );
    }

    const passwordMatches =
      await this.passwordHasher.verify(
        account.passwordHash,
        input.password,
      );

    if (!passwordMatches) {
      await this.recordFailedLogin(
        account.userId,
      );

      throw AppErrors.unauthorized(
        ErrorCode.INVALID_CREDENTIALS,
        "Invalid email or password",
      );
    }

    if (account.user.status !== "ACTIVE") {
      throw AppErrors.unauthorized(
        ErrorCode.UNAUTHORIZED,
        "Account is not active",
      );
    }

    const refreshToken =
      randomBytes(32).toString("base64url");

    const refreshTokenHash =
      hashToken(refreshToken);

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

    const result =
      await this.prisma.$transaction(
        async (tx) => {
          const session =
            await tx.session.create({
              data: {
                userId: account.userId,
                tokenHash: refreshTokenHash,
                expiresAt,
                status: "ACTIVE",
              },
            });

          await tx.securityEvent.create({
            data: {
              userId: account.userId,
              type: "LOGIN_SUCCESS",
            },
          });

          return session;
        },
      );

    const accessToken =
      await this.tokenService.createAccessToken({
        userId: account.userId,
        sessionId: result.id,
      });

    return {
      user: {
        userId: account.userId,
      },
      accessToken,
      refreshToken,
      expiresAt,
    };
  }

    private async recordFailedLogin(
        userId?: string,
    ): Promise<void> {
        const data = {
            type: "LOGIN_FAILED" as const,
            ...(userId ? { userId } : {}),
        };

        await this.prisma.securityEvent.create({
            data,
        });
    }
}