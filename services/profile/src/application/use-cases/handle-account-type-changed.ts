import type { PrismaClient } from "../../generated/prisma/index.js";

import type {
  AccountTypeChangedEvent,
} from "@talent/event-schemas";

export class HandleAccountTypeChangedUseCase {
  constructor(
    private readonly prisma: PrismaClient,
  ) {}

  async execute(
    event: AccountTypeChangedEvent,
  ): Promise<{ processed: boolean }> {
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
          };
        }

        const account =
          await tx.account.findUnique({
            where: {
              userId: event.payload.userId,
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
         * Defensive ordering check.
         *
         * Identity guarantees the transition:
         *
         * USER -> TALENT
         * USER -> PROFESSIONAL
         * TALENT -> PROFESSIONAL
         *
         * Profile must still represent the previous state
         * before applying the event.
         */
        if (
          account.type !==
          event.payload.previousAccountType
        ) {
          throw new Error(
            `Account type mismatch: expected ${event.payload.previousAccountType}, found ${account.type}`,
          );
        }

        await tx.account.update({
          where: {
            id: account.id,
          },
          data: {
            type: event.payload.newAccountType,
          },
        });

        switch (
          event.payload.newAccountType
        ) {
          case "TALENT": {
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
                  accountId: account.id,
                  status: "ACTIVE",
                  score: 0,
                },
              });
            }

            break;
          }

          case "PROFESSIONAL": {
            if (
              account.talentProfile
            ) {
              await tx.talentProfile.delete({
                where: {
                  accountId: account.id,
                },
              });
            }

            if (
              !account.professionalProfile
            ) {
              await tx.professionalProfile.create({
                data: {
                  accountId: account.id,
                },
              });
            }

            break;
          }

          case "USER":
            throw new Error(
              "Account upgrade event cannot target USER",
            );

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
        };
      },
    );
  }
}