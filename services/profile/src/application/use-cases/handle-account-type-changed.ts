import type { PrismaClient } from "../../generated/prisma/index.js";

import type {
  AccountTypeChangedEvent,
} from "@talent/event-schemas";

type AccountType =
  | "USER"
  | "TALENT"
  | "PROFESSIONAL";

type AccountTypeChangeResult = {
  processed: boolean;
  outcome:
    | "APPLIED"
    | "IGNORED_STALE";
};

const ACCOUNT_TYPE_ORDER: Record<
  AccountType,
  number
> = {
  USER: 0,
  TALENT: 1,
  PROFESSIONAL: 2,
};

export class HandleAccountTypeChangedUseCase {
  constructor(
    private readonly prisma: PrismaClient,
  ) {}

  async execute(
    event: AccountTypeChangedEvent,
  ): Promise<AccountTypeChangeResult> {
    return this.prisma.$transaction(
      async (tx) => {
        const inserted =
          await tx.processedEvent.createMany({
            data: [
              {
                eventId: event.eventId,
                eventType: event.eventType,
              },
            ],
            skipDuplicates: true,
          });

        if (inserted.count === 0) {
          return {
            processed: false,
            outcome: "IGNORED_STALE",
          };
        }

        const account =
          await tx.account.findUnique({
            where: {
              userId:
                event.payload.userId,
            },
            include: {
              talentProfile: true,
              professionalProfile: true,
            },
          });

        if (!account) {
          throw new Error(
            `Profile account not found for user ${event.payload.userId}`,
          );
        }

        /*
         * Identity never emits an upgrade
         * targeting USER.
         */
        if (
          event.payload.newAccountType ===
          "USER"
        ) {
          throw new Error(
            "Account upgrade event cannot target USER",
          );
        }

        /*
         * Expected normal flow:
         *
         * account.type === previousAccountType
         *
         * Example:
         *
         * TALENT
         *   +
         * TALENT -> PROFESSIONAL
         *   =
         * PROFESSIONAL
         */

        if (
          account.type ===
          event.payload.previousAccountType
        ) {
          await tx.account.update({
            where: {
              id: account.id,
            },
            data: {
              type:
                event.payload.newAccountType,
            },
          });

          switch (event.payload.newAccountType) {
            case "TALENT": {
              if (account.professionalProfile) {
                throw new Error(
                  "Cannot convert account to TALENT while PROFESSIONAL profile exists",
                );
              }

              if (!account.talentProfile) {
                await tx.talentProfile.create({
                  data: {
                    accountId: account.id,
                    status: "ACTIVE",
                    score: 0,
                  },
                });
              }

              break;
            }

            case "PROFESSIONAL": {
              if (account.talentProfile) {
                await tx.talentProfile.delete({
                  where: {
                    accountId: account.id,
                  },
                });
              }

              if (!account.professionalProfile) {
                await tx.professionalProfile.create({
                  data: {
                    accountId: account.id,
                  },
                });
              }

              break;
            }

            default: {
              const exhaustiveCheck: never =
                event.payload.newAccountType;

              throw new Error(
                `Unsupported target account type: ${exhaustiveCheck}`,
              );
            }
          }

          return {
            processed: true,
            outcome: "APPLIED",
          };
        }

        /*
         * The current Profile state is already
         * at or beyond the event target.
         *
         * Example:
         *
         * Current:
         *   PROFESSIONAL
         *
         * Old event:
         *   USER -> TALENT
         *
         * Applying it would be invalid and
         * would regress the aggregate.
         *
         * Treat it as a stale event and
         * acknowledge it through processedEvent.
         */
        const currentOrder =
          ACCOUNT_TYPE_ORDER[
            account.type
          ];

        const targetOrder =
          ACCOUNT_TYPE_ORDER[
            event.payload
              .newAccountType
          ];

        if (
          currentOrder >=
          targetOrder
        ) {
          return {
            processed: false,
            outcome: "IGNORED_STALE",
          };
        }

        /*
         * Current state is behind the event's
         * declared previous state.
         *
         * Example:
         *
         * Current:
         *   USER
         *
         * Event:
         *   TALENT -> PROFESSIONAL
         *
         * We must not skip this event because
         * the preceding transition may not have
         * reached Profile yet.
         *
         * Throwing keeps the Kafka offset
         * uncommitted so the event can be retried.
         */
        throw new Error(
          `Account type mismatch: expected ${event.payload.previousAccountType}, found ${account.type}`,
        );
      },
    );
  }
}