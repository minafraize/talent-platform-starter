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
              status: true,
              accountType: true,
            },
          });

        if (!user) {
          throw AppErrors.notFound(
            ErrorCode.NOT_FOUND,
            "User not found",
          );
        }

        /*
         * USER is not a valid upgrade target.
         *
         * This must be checked before the
         * idempotency check so that:
         *
         *   USER -> USER
         *
         * is not accidentally treated as
         * a successful no-op.
         */
        if (
          input.targetAccountType ===
          "USER"
        ) {
          throw AppErrors.conflict(
            ErrorCode.CONFLICT,
            `Cannot upgrade account from ${user.accountType} to USER`,
          );
        }

        /*
         * Only active accounts are allowed to
         * perform account upgrades.
         *
         * This is a business rule, not merely
         * an authentication rule.
         */
        if (
          user.status === "SUSPENDED"
        ) {
          throw AppErrors.forbidden(
            "Suspended accounts cannot be upgraded",
          );
        }

        if (
          user.status === "DELETED"
        ) {
          throw AppErrors.forbidden(
            "Deleted accounts cannot be upgraded",
          );
        }

        const currentAccountType =
          user.accountType as AccountType;

        /*
         * Idempotent retry.
         *
         * Example:
         *
         * First request:
         *   USER -> TALENT
         *   -> 200
         *
         * Client does not receive the response
         * and retries:
         *   TALENT -> TALENT
         *   -> 200
         *
         * No new state transition and no duplicate
         * outbox event are created.
         */
        if (
          currentAccountType ===
          input.targetAccountType
        ) {
          return {
            userId:
              input.userId,

            previousAccountType:
              currentAccountType,

            newAccountType:
              currentAccountType,
          };
        }

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

        /*
         * The optimistic state checks are repeated
         * directly in the UPDATE statement.
         *
         * This protects us from a concurrent request
         * changing either:
         *
         *   accountType
         *
         * or:
         *
         *   status
         *
         * after the SELECT above.
         */
        const updated =
          await tx.user.updateMany({
            where: {
              id:
                input.userId,

              status:
                "ACTIVE",

              accountType:
                currentAccountType,
            },

            data: {
              accountType:
                input.targetAccountType,
            },
          });

        if (
          updated.count !== 1
        ) {
          throw AppErrors.conflict(
            ErrorCode.CONFLICT,
            "Account state was changed by another request",
          );
        }

        /*
         * The account state change and its event
         * are committed atomically.
         *
         * Either both exist or neither exists.
         */
        await tx.outboxEvent.create({
          data: {
            eventId:
              randomUUID(),

            eventType:
              "identity.account.type.changed",

            aggregateType:
              "User",

            aggregateId:
              input.userId,

            payload: {
              userId:
                input.userId,

              previousAccountType:
                currentAccountType,

              newAccountType:
                input.targetAccountType,
            },
          },
        });

        return {
          userId:
            input.userId,

          previousAccountType:
            currentAccountType,

          newAccountType:
            input.targetAccountType,
        };
      },
    );
  }
}