import { randomUUID } from "node:crypto";

import {
  Kafka,
  type Admin,
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

const kafka =
  new Kafka({
    clientId:
      `profile-redelivery-tests-${randomUUID()}`,

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

  timeoutMs =
    30_000,

  intervalMs =
    250,
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

    await new Promise<void>(
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

async function createTopic(
  admin:
    Admin,

  topic:
    string,
): Promise<void> {
  await admin.createTopics({
    waitForLeaders:
      true,

    topics: [
      {
        topic,

        numPartitions:
          1,

        replicationFactor:
          1,
      },
    ],
  });
}

async function cleanupUserState(
  userId:
    string,

  eventId:
    string,
): Promise<void> {
  await prisma.account.deleteMany({
    where: {
      userId,
    },
  });

  await prisma.processedEvent.deleteMany({
    where: {
      eventId,
    },
  });
}

describe(
  "Kafka redelivery after profile failure",
  () => {
    let producer:
      Producer;

    let admin:
      Admin;

    beforeAll(
      async () => {
        admin =
          kafka.admin();

        await admin.connect();

        producer =
          kafka.producer();

        await producer.connect();
      },
    );

    afterAll(
      async () => {
        await producer.disconnect();

        await admin.disconnect();

        await prisma.$disconnect();
      },
    );

    it(
      "redelivers an event after the first processing attempt fails",
      async () => {
        const topic =
          `identity.events.redelivery.account-${randomUUID()}`;

        const eventId =
          randomUUID();

        const userId =
          randomUUID();

        const failureInjector =
          new FailOnceProfileTransaction(
            "ACCOUNT_CREATION",
          );

        let consumerRuntime:
          | ProfileEventsConsumerRuntime
          | undefined;

        try {
          await createTopic(
            admin,
            topic,
          );

          consumerRuntime =
            await startProfileEventsConsumer(
              prisma,
              {
                topic,

                groupId:
                  `profile-redelivery-account-${randomUUID()}`,

                fromBeginning:
                  true,

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
              userId,

              email:
                `${userId}@redelivery.test`,

              accountType:
                "TALENT" as const,
            },
          };

          await producer.send({
            topic,

            messages: [
              {
                partition:
                  0,

                key:
                  userId,

                value:
                  JSON.stringify(
                    event,
                  ),
              },
            ],
          });

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

                professionalProfile:
                  true,
              },
            });

          expect(
            account,
          ).not.toBeNull();

          expect(
            account?.type,
          ).toBe(
            "TALENT",
          );

          expect(
            account?.profile,
          ).not.toBeNull();

          expect(
            account?.talentProfile,
          ).not.toBeNull();

          expect(
            account?.professionalProfile,
          ).toBeNull();

          const processedEvent =
            await prisma.processedEvent.findUnique({
              where: {
                eventId,
              },
            });

          expect(
            processedEvent,
          ).not.toBeNull();

          const accountCount =
            await prisma.account.count({
              where: {
                userId,
              },
            });

          expect(
            accountCount,
          ).toBe(1);
        } finally {
          if (
            consumerRuntime
          ) {
            await consumerRuntime
              .stop()
              .catch(
                () => undefined,
              );
          }

          await cleanupUserState(
            userId,
            eventId,
          );

          await admin.deleteTopics({
            topics: [
              topic,
            ],
          });
        }
      },
      40_000,
    );

    it(
      "redelivers an account type change after the projection transaction fails",
      async () => {
        const topic =
          `identity.events.redelivery.account-type-${randomUUID()}`;

        const eventId =
          randomUUID();

        const userId =
          randomUUID();

        const failureInjector =
          new FailOnceProfileTransaction(
            "ACCOUNT_TYPE_CHANGE",
          );

        let consumerRuntime:
          | ProfileEventsConsumerRuntime
          | undefined;

        try {
          await createTopic(
            admin,
            topic,
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

          consumerRuntime =
            await startProfileEventsConsumer(
              prisma,
              {
                topic,

                groupId:
                  `profile-redelivery-account-type-${randomUUID()}`,

                fromBeginning:
                  true,

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
                partition:
                  0,

                key:
                  userId,

                value:
                  JSON.stringify(
                    event,
                  ),
              },
            ],
          });

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
          ).toBe(
            "TALENT",
          );

          expect(
            account?.profile,
          ).not.toBeNull();

          expect(
            account?.talentProfile,
          ).not.toBeNull();

          expect(
            account?.professionalProfile,
          ).toBeNull();

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
        } finally {
          if (
            consumerRuntime
          ) {
            await consumerRuntime
              .stop()
              .catch(
                () => undefined,
              );
          }

          await cleanupUserState(
            userId,
            eventId,
          );

          await admin.deleteTopics({
            topics: [
              topic,
            ],
          });
        }
      },
      40_000,
    );
  },
);