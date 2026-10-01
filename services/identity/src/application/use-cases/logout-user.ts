import type { PrismaClient } from "../../generated/prisma/index.js";

import {
  AppErrors,
  ErrorCode,
} from "@talent/errors";

import {
  hashToken,
} from "../../infrastructure/security/token-hash.js";

export interface LogoutUserInput {
  refreshToken: string;
}

export class LogoutUserUseCase {
  constructor(
    private readonly prisma: PrismaClient,
  ) {}

  async execute(
    input: LogoutUserInput,
  ): Promise<void> {
    const tokenHash =
      hashToken(input.refreshToken);

    const session =
      await this.prisma.session.findUnique({
        where: {
          tokenHash,
        },
      });

    if (!session) {
      throw AppErrors.unauthorized(
        ErrorCode.UNAUTHORIZED,
        "Invalid refresh token",
      );
    }

    if (session.status === "REVOKED") {
      return;
    }

    await this.prisma.$transaction(
      async (tx) => {
        await tx.session.update({
          where: {
            id: session.id,
          },
          data: {
            status: "REVOKED",
            revokedAt: new Date(),
          },
        });

        await tx.securityEvent.create({
          data: {
            userId: session.userId,
            type: "LOGOUT",
          },
        });
      },
    );
  }
}