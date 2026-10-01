import { randomUUID } from "node:crypto";

import type { PrismaClient } from "../../generated/prisma/index.js";
import type { AccountType } from "@talent/contracts";

import {
  AppErrors,
  ErrorCode,
} from "@talent/errors";

import {
  isAccountUpgradeAllowed,
} from "../../domain/account/account-type-transition.js";

export interface UpgradeAccountInput {
  userId: string;
  targetAccountType: AccountType;
}

export interface UpgradeAccountOutput {
  userId: string;
  previousAccountType: AccountType;
  newAccountType: AccountType;
}

export class UpgradeAccountUseCase {
  constructor(
    private readonly prisma: PrismaClient,
  ) {}

  async execute(
    input: UpgradeAccountInput,
  ): Promise<UpgradeAccountOutput> {
    return this.prisma.$transaction(
      async (tx) => {
        const user =
          await tx.user.findUnique({
            where: {
              id: input.userId,
            },
            select: {
              id: true,
              accountType: true,
            },
          });

        if (!user) {
          throw AppErrors.notFound(
            ErrorCode.NOT_FOUND,
            "User not found",
          );
        }

        const currentAccountType =
          user.accountType as AccountType;

        if (
          !isAccountUpgradeAllowed(
            currentAccountType,
            input.targetAccountType,
          )
        ) {
          throw AppErrors.conflict(
            ErrorCode.CONFLICT,
            `Cannot upgrade account from ${currentAccountType} to ${input.targetAccountType}`,
          );
        }

        const updated =
          await tx.user.updateMany({
            where: {
              id: input.userId,
              accountType:
                currentAccountType,
            },
            data: {
              accountType:
                input.targetAccountType,
            },
          });

        if (updated.count !== 1) {
          throw AppErrors.conflict(
            ErrorCode.CONFLICT,
            "Account type was changed by another request",
          );
        }

        await tx.outboxEvent.create({
          data: {
            eventId: randomUUID(),
            eventType:
              "identity.account.type.changed",
            aggregateType: "User",
            aggregateId: input.userId,

            payload: {
              userId: input.userId,
              previousAccountType:
                currentAccountType,
              newAccountType:
                input.targetAccountType,
            },
          },
        });

        return {
          userId: input.userId,
          previousAccountType:
            currentAccountType,
          newAccountType:
            input.targetAccountType,
        };
      },
    );
  }
}