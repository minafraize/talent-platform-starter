import type { PrismaClient } from "../../generated/prisma/index.js";

import {
  AppErrors,
  ErrorCode,
} from "@talent/errors";

export interface GetCurrentUserOutput {
  userId: string;
  status: string;
}

export class GetCurrentUserUseCase {
  constructor(
    private readonly prisma: PrismaClient,
  ) {}

  async execute(
    userId: string,
  ): Promise<GetCurrentUserOutput> {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          status: true,
        },
      });

    if (!user || user.status === "DELETED") {
      throw AppErrors.notFound(
        ErrorCode.NOT_FOUND,
        "User not found",
      );
    }

    return {
      userId: user.id,
      status: user.status,
    };
  }
}