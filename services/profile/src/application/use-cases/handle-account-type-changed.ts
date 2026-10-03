import type {
  PrismaClient,
} from "../../generated/prisma/index.js";

import type {
  AccountTypeChangedEvent,
} from "@talent/event-schemas";

import type {
  ProfileFailureInjector,
} from "../ports/profile-failure-injector.js";

type AccountType =
  | "USER"
  | "TALENT"
  | "PROFESSIONAL";

type AccountTypeChangeResult = {
  processed: boolean;

  outcome:
    | "APPLIED"
    | "APPLIED_WITH_GAP"
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

    private readonly failureInjector: ProfileFailureInjector = {
      shouldFailAfterAccountCreation:
        () => false,

      shouldFailAfterAccountTypeChange:
        () => false,
    },
  ) {}

  async execute(
    event: AccountTypeChangedEvent,
  ): Promise<AccountTypeChangeResult> {
    const previousAccountType =
      event.payload.previousAccountType;

    const newAccountType =
      event.payload.newAccountType;

    const previousOrder =
      ACCOUNT_TYPE_ORDER[
        previousAccountType
      ];

    const targetOrder =
      ACCOUNT_TYPE_ORDER[
        newAccountType
      ];

    /*
     * Identity only supports upgrades.
     *
     * Profile validates this independently
     * because Kafka events are an external
     * boundary from Profile's point of view.
     */
    if (newAccountType === "USER") {
      throw new Error(
        "Account upgrade event cannot target USER",
      );
    }

    if (
      previousOrder >= targetOrder
    ) {
      throw new Error(
        `Invalid account type transition: ${previousAccountType} -> ${newAccountType}`,
      );
    }

    return this.prisma.$transaction(
      async (tx) => {
        /*
         * Idempotency must happen in the same
         * transaction as the business mutation.
         *
         * First delivery:
         *   inserted.count === 1
         *
         * Duplicate delivery:
         *   inserted.count === 0
         */
        const inserted =
          await tx.processedEvent.createMany({
            data: [
              {
                eventId:
                  event.eventId,

                eventType:
                  event.eventType,
              },
            ],

            skipDuplicates: true,
          });

        if (inserted.count === 0) {
          return {
            processed: false,

            outcome:
              "IGNORED_STALE",
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

              professionalProfile:
                true,
            },
          });

        if (!account) {
          throw new Error(
            `Profile account not found for user ${event.payload.userId}`,
          );
        }

        const currentOrder =
          ACCOUNT_TYPE_ORDER[
            account.type
          ];

        /*
         * Profile is a monotonic projection.
         *
         * If it already reached or passed the
         * target state, applying this event would
         * either be unnecessary or would regress
         * the projection.
         */
        if (
          currentOrder >= targetOrder
        ) {
          return {
            processed: false,

            outcome:
              "IGNORED_STALE",
          };
        }

        /*
         * Normal case:
         *
         *   Profile current state
         *          ===
         *   event.previousAccountType
         *
         * Gap case:
         *
         *   Profile current state
         *          <
         *   event.previousAccountType
         *
         * In the gap case, Identity is already
         * authoritative, so Profile converges
         * directly to the latest valid target.
         */
        const outcome =
          currentOrder ===
          previousOrder
            ? "APPLIED"
            : "APPLIED_WITH_GAP";

        await tx.account.update({
          where: {
            id:
              account.id,
          },

          data: {
            type:
              newAccountType,
          },
        });

        switch (newAccountType) {
          case "TALENT": {
            /*
             * PROFESSIONAL is a higher state and
             * therefore should never coexist with
             * TALENT.
             */
            if (
              account.professionalProfile
            ) {
              throw new Error(
                "Cannot convert account to TALENT while PROFESSIONAL profile exists",
              );
            }

            if (
              !account.talentProfile
            ) {
              await tx.talentProfile.create({
                data: {
                  accountId:
                    account.id,

                  status:
                    "ACTIVE",

                  score:
                    0,
                },
              });
            }

            break;
          }

          case "PROFESSIONAL": {
            /*
             * PROFESSIONAL supersedes TALENT.
             */
            if (
              account.talentProfile
            ) {
              await tx.talentProfile.delete({
                where: {
                  accountId:
                    account.id,
                },
              });
            }

            if (
              !account.professionalProfile
            ) {
              await tx.professionalProfile.create({
                data: {
                  accountId:
                    account.id,
                },
              });
            }

            break;
          }
        }

        /*
         * Failure injection intentionally happens
         * after the projection mutation but before
         * the transaction commits.
         *
         * This proves that:
         *
         *   account update
         *   persona update
         *   processedEvent
         *
         * are committed atomically.
         *
         * If this throws, KafkaJS receives the error
         * and the message remains eligible for retry.
         */
        if (
          this.failureInjector
            .shouldFailAfterAccountTypeChange()
        ) {
          throw new Error(
            "PROFILE_ACCOUNT_TYPE_TRANSACTION_FAILURE",
          );
        }

        return {
          processed:
            true,

          outcome,
        };
      },
    );
  }
}