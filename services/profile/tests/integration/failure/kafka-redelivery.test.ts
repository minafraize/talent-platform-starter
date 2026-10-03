import { randomUUID } from "node:crypto";

import {
  Kafka,
  type Producer,
} from "kafkajs";

import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";

import { prisma } from "../../../src/infrastructure/database/prisma.js";

import {
  startProfileEventsConsumer,
} from "../../../src/infrastructure/kafka/profile-events.consumer.js";

import type {
  ProfileEventsConsumerRuntime,
} from "../../../src/infrastructure/kafka/profile-events.consumer.js";

import type {
  ProfileFailureInjector,
} from "../../../src/application/ports/profile-failure-injector.js";

const brokers = (
  process.env.KAFKA_BROKERS ??
  "localhost:9092"
).split(",");

const topic =
  process.env.KAFKA_PROFILE_TEST_TOPIC ??
  "identity.events.test";

const kafka =
  new Kafka({
    clientId:
      `profile-redelivery-${randomUUID()}`,

    brokers,
  });

type FailurePoint =
  | "ACCOUNT_CREATION"
  | "ACCOUNT_TYPE_CHANGE";

class FailOnceProfileTransaction
  implements ProfileFailureInjector
{
  accountCreationAttempts =
    0;

  accountTypeChangeAttempts =
    0;

  constructor(
    private readonly failurePoint:
      FailurePoint,
  ) {}

  shouldFailAfterAccountCreation():
    boolean {
    this.accountCreationAttempts++;

    return (
      this.failurePoint ===
        "ACCOUNT_CREATION" &&
      this.accountCreationAttempts ===
        1
    );
  }

  shouldFailAfterAccountTypeChange():
    boolean {
    this.accountTypeChangeAttempts++;

    return (
      this.failurePoint ===
        "ACCOUNT_TYPE_CHANGE" &&
      this.accountTypeChangeAttempts ===
        1
    );
  }
}

async function waitFor(
  condition:
    () => Promise<boolean>,

  timeoutMs = 30_000,

  intervalMs = 250,
): Promise<void> {
  const startedAt =
    Date.now();

  while (
    Date.now() -
      startedAt <
    timeoutMs
  ) {
    if (
      await condition()
    ) {
      return;
    }

    await new Promise(
      (resolve) => {
        setTimeout(
          resolve,
          intervalMs,
        );
      },
    );
  }

  throw new Error(
    `Condition was not satisfied within ${timeoutMs}ms`,
  );
}

describe(
  "Kafka redelivery after profile failure",
  () => {
    let producer:
      Producer;

    let consumerRuntime:
      | ProfileEventsConsumerRuntime
      | undefined;

    beforeAll(
      async () => {
        producer =
          kafka.producer();

        await producer.connect();
      },
    );

    afterAll(
      async () => {
        if (
          consumerRuntime
        ) {
          await consumerRuntime.stop();
        }

        await producer.disconnect();

        await prisma.$disconnect();
      },
    );

    it(
      "redelivers an event after the first processing attempt fails",
      async () => {
        const eventId =
          randomUUID();

        const userId =
          randomUUID();

        const failureInjector =
          new FailOnceProfileTransaction(
            "ACCOUNT_CREATION",
          );

        const groupId =
          `profile-redelivery-${randomUUID()}`;

        consumerRuntime =
          await startProfileEventsConsumer(
            prisma,
            {
              topic,

              groupId,

              fromBeginning:
                false,

              waitForReady:
                true,

              readyTimeoutMs:
                10_000,

              failureInjector,
            },
          );

        const event = {
          eventId,

          eventType:
            "identity.user.created" as const,

          version:
            1,

          producer:
            "identity-service",

          occurredAt:
            new Date().toISOString(),

          aggregateId:
            userId,

          payload: {
            version:
              1,

            producer:
              "identity-service",

            occurredAt:
              new Date().toISOString(),

            userId,

            accountType:
              "TALENT" as const,

            email:
              `${userId}@redelivery.test`,
          },
        };

        await producer.send({
          topic,

          messages: [
            {
              key:
                userId,

              value:
                JSON.stringify(
                  event,
                ),
            },
          ],
        });

        /**
         * Wait until the message has actually
         * been processed successfully after
         * the first failed attempt.
         */
        await waitFor(
          async () => {
            const account =
              await prisma.account.findUnique({
                where: {
                  userId,
                },
              });

            return (
              account !==
              null
            );
          },
        );

        /**
         * First attempt failed.
         * Second attempt succeeded.
         */
        expect(
          failureInjector.accountCreationAttempts,
        ).toBeGreaterThanOrEqual(
          2,
        );

        const account =
          await prisma.account.findUnique({
            where: {
              userId,
            },

            include: {
              profile:
                true,

              talentProfile:
                true,
            },
          });

        expect(
          account,
        ).not.toBeNull();

        expect(
          account?.type,
        ).toBe("TALENT");

        expect(
          account?.profile,
        ).not.toBeNull();

        expect(
          account?.talentProfile,
        ).not.toBeNull();

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
        ).not.toBeNull();

        /**
         * There must only be one business
         * Account after the redelivery.
         */
        const accounts =
          await prisma.account.count({
            where: {
              userId,
            },
          });

        expect(
          accounts,
        ).toBe(1);

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

        await consumerRuntime.stop();

        consumerRuntime =
          undefined;
      },
      40_000,
    );

    it(
      "redelivers an account type change after the projection transaction fails",
      async () => {
        const eventId =
          randomUUID();

        const userId =
          randomUUID();

        const failureInjector =
          new FailOnceProfileTransaction(
            "ACCOUNT_TYPE_CHANGE",
          );

        const groupId =
          `profile-account-type-redelivery-${randomUUID()}`;

        consumerRuntime =
          await startProfileEventsConsumer(
            prisma,
            {
              topic,

              groupId,

              fromBeginning:
                false,

              waitForReady:
                true,

              readyTimeoutMs:
                10_000,

              failureInjector,
            },
          );

        await prisma.account.create({
          data: {
            userId,

            type:
              "USER",

            status:
              "ACTIVE",

            profile: {
              create: {},
            },
          },
        });

        const event = {
          eventId,

          eventType:
            "identity.account.type.changed" as const,

          version:
            1,

          producer:
            "identity-service",

          occurredAt:
            new Date().toISOString(),

          aggregateId:
            userId,

          payload: {
            userId,

            previousAccountType:
              "USER" as const,

            newAccountType:
              "TALENT" as const,
          },
        };

        await producer.send({
          topic,

          messages: [
            {
              key:
                userId,

              value:
                JSON.stringify(
                  event,
                ),
            },
          ],
        });

        /*
         * Wait until the event has eventually
         * succeeded after the first failure.
         */
        await waitFor(
          async () => {
            const account =
              await prisma.account.findUnique({
                where: {
                  userId,
                },

                include: {
                  talentProfile:
                    true,

                  professionalProfile:
                    true,
                },
              });

            return (
              account?.type ===
                "TALENT" &&
              account.talentProfile !==
                null
            );
          },
        );

        /*
         * First processing attempt failed.
         * A later Kafka delivery succeeded.
         */
        expect(
          failureInjector.accountTypeChangeAttempts,
        ).toBeGreaterThanOrEqual(
          2,
        );

        const account =
          await prisma.account.findUnique({
            where: {
              userId,
            },

            include: {
              profile:
                true,

              talentProfile:
                true,

              professionalProfile:
                true,
            },
          });

        expect(
          account,
        ).not.toBeNull();

        expect(
          account?.type,
        ).toBe("TALENT");

        expect(
          account?.profile,
        ).not.toBeNull();

        expect(
          account?.talentProfile,
        ).not.toBeNull();

        expect(
          account?.professionalProfile,
        ).toBeNull();

        /*
         * The failed transaction must not leave
         * duplicate or partial projection state.
         */
        const accountCount =
          await prisma.account.count({
            where: {
              userId,
            },
          });

        expect(
          accountCount,
        ).toBe(1);

        const talentProfileCount =
          await prisma.talentProfile.count({
            where: {
              accountId:
                account!.id,
            },
          });

        expect(
          talentProfileCount,
        ).toBe(1);

        /*
         * processedEvent is written in the same
         * transaction as the projection.
         *
         * Therefore it should only exist after
         * the successful retry.
         */
        const processedEvents =
          await prisma.processedEvent.count({
            where: {
              eventId,
            },
          });

        expect(
          processedEvents,
        ).toBe(1);

        const processedEvent =
          await prisma.processedEvent.findUnique({
            where: {
              eventId,
            },
          });

        expect(
          processedEvent?.eventType,
        ).toBe(
          "identity.account.type.changed",
        );

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

        await consumerRuntime.stop();

        consumerRuntime =
          undefined;
      },
      40_000,
    );
  },
);