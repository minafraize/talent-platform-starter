import {
  afterAll,
  describe,
  expect,
  it,
} from "vitest";

import { randomUUID } from "node:crypto";

import { prisma } from "../../../src/infrastructure/database/prisma.js";

import {
  HandleUserCreatedUseCase,
  type IdentityUserCreatedEvent,
} from "../../../src/application/use-cases/handle-user-created.js";

import type {
  ProfileFailureInjector,
} from "../../../src/application/ports/profile-failure-injector.js";

class AlwaysFailProfileTransaction
  implements ProfileFailureInjector
{
  shouldFailAfterAccountCreation(): boolean {
    return true;
  }
}

describe(
  "Profile transaction failure",
  () => {
    afterAll(async () => {
      await prisma.$disconnect();
    });

    it(
      "rolls back all profile writes and allows the event to be retried",
      async () => {
        const userId = randomUUID();
        const eventId = randomUUID();

        const event: IdentityUserCreatedEvent =
          {
            eventId,
            eventType:
              "identity.user.created",
            version: 1,
            producer:
              "identity-service",
            occurredAt:
              new Date().toISOString(),
            userId,
            accountType: "TALENT",
            email: `${userId}@failure.test`,
          };

        const failingUseCase =
          new HandleUserCreatedUseCase(
            prisma,
            new AlwaysFailProfileTransaction(),
          );

        await expect(
          failingUseCase.execute(event),
        ).rejects.toThrow(
          "PROFILE_TRANSACTION_FAILURE",
        );

        /**
         * Everything must have been rolled back.
         */
        const account =
          await prisma.account.findUnique({
            where: {
              userId,
            },
          });

        expect(account).toBeNull();

        const processedEvent =
          await prisma.processedEvent.findUnique(
            {
              where: {
                eventId,
              },
            },
          );

        expect(
          processedEvent,
        ).toBeNull();

        /**
         * Retry using the normal use case.
         */
        const recoveryUseCase =
          new HandleUserCreatedUseCase(
            prisma,
          );

        const result =
          await recoveryUseCase.execute(
            event,
          );

        expect(result).toEqual({
          processed: true,
        });

        const recoveredAccount =
          await prisma.account.findUnique({
            where: {
              userId,
            },
            include: {
              profile: true,
              talentProfile: true,
              professionalProfile: true,
            },
          });

        expect(
          recoveredAccount,
        ).not.toBeNull();

        expect(
          recoveredAccount?.type,
        ).toBe("TALENT");

        expect(
          recoveredAccount?.profile,
        ).not.toBeNull();

        expect(
          recoveredAccount?.talentProfile,
        ).not.toBeNull();

        const recoveredEvent =
          await prisma.processedEvent.findUnique(
            {
              where: {
                eventId,
              },
            },
          );

        expect(
          recoveredEvent,
        ).not.toBeNull();

        /**
         * Cleanup.
         */
        await prisma.account.delete({
          where: {
            userId,
          },
        });

        await prisma.processedEvent.delete({
          where: {
            eventId,
          },
        });
      },
    );
  },
);