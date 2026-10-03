import type { PrismaClient } from "../../generated/prisma/index.js";

import type {
  ProfileFailureInjector,
} from "../ports/profile-failure-injector.js";

export type AccountType =
  | "USER"
  | "TALENT"
  | "PROFESSIONAL";

export interface IdentityUserCreatedEvent {
  eventId:
    string;

  eventType:
    "identity.user.created";

  version:
    number;

  producer:
    string;

  occurredAt:
    string;

  userId:
    string;

  accountType:
    AccountType;

  email:
    string;
}

export class HandleUserCreatedUseCase {
  constructor(
    private readonly prisma:
      PrismaClient,

    private readonly failureInjector:
      ProfileFailureInjector = {
        shouldFailAfterAccountCreation:
          () => false,

        shouldFailAfterAccountTypeChange:
          () => false,
      },
  ) {}

  async execute(
    event:
      IdentityUserCreatedEvent,
  ): Promise<{
    processed:
      boolean;
  }> {
    return this.prisma.$transaction(
      async (tx) => {
        /**
         * Idempotency protection.
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

            skipDuplicates:
              true,
          });

        if (
          inserted.count ===
          0
        ) {
          return {
            processed:
              false,
          };
        }

        const account =
          await tx.account.create({
            data: {
              userId:
                event.userId,

              type:
                event.accountType,

              status:
                "ACTIVE",
            },
          });

        if (
          this.failureInjector
            .shouldFailAfterAccountCreation()
        ) {
          throw new Error(
            "PROFILE_TRANSACTION_FAILURE",
          );
        }

        await tx.profile.create({
          data: {
            accountId:
              account.id,
          },
        });

        switch (
          event.accountType
        ) {
          case "USER":
            break;

          case "TALENT":
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
            break;

          case "PROFESSIONAL":
            await tx.professionalProfile.create({
              data: {
                accountId:
                  account.id,
              },
            });
            break;

          default: {
            const exhaustiveCheck:
              never =
              event.accountType;

            throw new Error(
              `Unsupported account type: ${exhaustiveCheck}`,
            );
          }
        }

        return {
          processed:
            true,
        };
      },
    );
  }
}