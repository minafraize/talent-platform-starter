import { randomUUID } from "node:crypto";

import {
  Kafka,
  type Admin,
  type Consumer,
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

const brokers = (
  process.env.KAFKA_BROKERS ??
  "localhost:9092"
).split(",");

const kafka =
  new Kafka({
    clientId:
      `profile-dlq-tests-${randomUUID()}`,

    brokers,
  });

interface DeadLetterRecord {
  version:
    1;

  eventType:
    "profile.event.dead_lettered";

  producer:
    "profile-service";

  occurredAt:
    string;

  reason:
    | "MISSING_MESSAGE_VALUE"
    | "INVALID_JSON"
    | "INVALID_EVENT"
    | "LEGACY_EVENT_WITHOUT_ACCOUNT_TYPE";

  error:
    string;

  source: {
    topic:
      string;

    partition:
      number;

    offset:
      string;

    key:
      string | null;

    timestamp:
      string | null;
  };

  rawValue:
    string | null;
}

interface DlqObserver {
  messages:
    DeadLetterRecord[];

  stop():
    Promise<void>;
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

async function waitForConsumerReady(
  consumer:
    Consumer,

  timeoutMs =
    10_000,
): Promise<void> {
  await new Promise<void>(
    (
      resolve,
      reject,
    ) => {
      let settled =
        false;

      const finish = (
        callback:
          () => void,
      ): void => {
        if (
          settled
        ) {
          return;
        }

        settled =
          true;

        clearTimeout(
          timer,
        );

        callback();
      };

      const timer =
        setTimeout(
          () => {
            finish(() => {
              reject(
                new Error(
                  `Kafka consumer did not join its group within ${timeoutMs}ms`,
                ),
              );
            });
          },
          timeoutMs,
        );

      consumer.on(
        consumer.events.GROUP_JOIN,
        () => {
          finish(resolve);
        },
      );

      consumer.on(
        consumer.events.CRASH,
        () => {
          finish(() => {
            reject(
              new Error(
                "Kafka consumer crashed before it became ready",
              ),
            );
          });
        },
      );
    },
  );
}

async function createTopics(
  admin:
    Admin,
  sourceTopic:
    string,
  dlqTopic:
    string,
): Promise<void> {
  await admin.createTopics({
    waitForLeaders:
      true,

    topics: [
      {
        topic:
          sourceTopic,

        numPartitions:
          1,

        replicationFactor:
          1,
      },

      {
        topic:
          dlqTopic,

        numPartitions:
          1,

        replicationFactor:
          1,
      },
    ],
  });
}

async function startDlqObserver(
  topic:
    string,
): Promise<DlqObserver> {
  const consumer =
    kafka.consumer({
      groupId:
        `profile-dlq-reader-${randomUUID()}`,
    });

  const messages:
    DeadLetterRecord[] = [];

  await consumer.connect();

  await consumer.subscribe({
    topic,

    fromBeginning:
      true,
  });

  const ready =
    waitForConsumerReady(
      consumer,
      10_000,
    );

  await consumer.run({
    eachMessage:
      async ({
        message,
      }) => {
        if (
          !message.value
        ) {
          return;
        }

        const record =
          JSON.parse(
            message.value.toString(
              "utf8",
            ),
          ) as DeadLetterRecord;

        messages.push(
          record,
        );
      },
  });

  await ready;

  return {
    messages,

    async stop(): Promise<void> {
      await consumer.disconnect();
    },
  };
}

async function cleanupProjection(
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
  "Profile Kafka DLQ",
  () => {
    let admin:
      Admin;

    let producer:
      Producer;

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
      "moves invalid JSON to DLQ and continues processing the next event",
      async () => {
        const sourceTopic =
          `identity.events.dlq-invalid-json-${randomUUID()}`;

        const dlqTopic =
          `${sourceTopic}.dlq`;

        const invalidUserId =
          randomUUID();

        const validUserId =
          randomUUID();

        const validEventId =
          randomUUID();

        let runtime:
          | ProfileEventsConsumerRuntime
          | undefined;

        let dlqObserver:
          | DlqObserver
          | undefined;

        try {
          await createTopics(
            admin,
            sourceTopic,
            dlqTopic,
          );

          runtime =
            await startProfileEventsConsumer(
              prisma,
              {
                topic:
                  sourceTopic,

                dlqTopic,

                groupId:
                  `profile-dlq-invalid-json-${randomUUID()}`,

                fromBeginning:
                  true,

                waitForReady:
                  true,

                readyTimeoutMs:
                  10_000,
              },
            );

          const validEvent = {
            eventId:
              validEventId,

            eventType:
              "identity.user.created" as const,

            version:
              1,

            producer:
              "identity-service",

            occurredAt:
              new Date().toISOString(),

            aggregateId:
              validUserId,

            payload: {
              userId:
                validUserId,

              email:
                `${validUserId}@dlq.test`,

              accountType:
                "TALENT" as const,
            },
          };

          await producer.send({
            topic:
              sourceTopic,

            messages: [
              {
                partition:
                  0,

                key:
                  invalidUserId,

                value:
                  "{invalid-json",
              },

              {
                partition:
                  0,

                key:
                  validUserId,

                value:
                  JSON.stringify(
                    validEvent,
                  ),
              },
            ],
          });

          /*
           * The source consumer must process
           * the valid event after handling the
           * malformed event.
           */
          await waitFor(
            async () => {
              const account =
                await prisma.account.findUnique({
                  where: {
                    userId:
                      validUserId,
                  },
                });

              return (
                account !==
                null
              );
            },
          );

          /*
           * Only now attach the DLQ observer.
           *
           * fromBeginning=true + unique topic
           * guarantees that we cannot miss the
           * dead-letter message.
           */
          dlqObserver =
            await startDlqObserver(
              dlqTopic,
            );

          await waitFor(
            async () => {
              return dlqObserver!.messages.some(
                (
                  message,
                ) =>
                  message.reason ===
                    "INVALID_JSON" &&
                  message.source.topic ===
                    sourceTopic &&
                  message.source.partition ===
                    0 &&
                  message.source.key ===
                    invalidUserId &&
                  message.rawValue ===
                    "{invalid-json",
              );
            },
          );

          const deadLetter =
            dlqObserver.messages.find(
              (
                message,
              ) =>
                message.reason ===
                  "INVALID_JSON" &&
                message.source.topic ===
                  sourceTopic &&
                message.source.partition ===
                  0 &&
                message.source.key ===
                  invalidUserId,
            );

          expect(
            deadLetter,
          ).toBeDefined();

          expect(
            deadLetter?.version,
          ).toBe(1);

          expect(
            deadLetter?.eventType,
          ).toBe(
            "profile.event.dead_lettered",
          );

          expect(
            deadLetter?.producer,
          ).toBe(
            "profile-service",
          );

          expect(
            deadLetter?.rawValue,
          ).toBe(
            "{invalid-json",
          );

          const invalidAccount =
            await prisma.account.findUnique({
              where: {
                userId:
                  invalidUserId,
              },
            });

          expect(
            invalidAccount,
          ).toBeNull();

          const validAccount =
            await prisma.account.findUnique({
              where: {
                userId:
                  validUserId,
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
            validAccount,
          ).not.toBeNull();

          expect(
            validAccount?.type,
          ).toBe(
            "TALENT",
          );

          expect(
            validAccount?.profile,
          ).not.toBeNull();

          expect(
            validAccount?.talentProfile,
          ).not.toBeNull();

          expect(
            validAccount?.professionalProfile,
          ).toBeNull();

          const processedEvent =
            await prisma.processedEvent.findUnique({
              where: {
                eventId:
                  validEventId,
              },
            });

          expect(
            processedEvent,
          ).not.toBeNull();

          await cleanupProjection(
            validUserId,
            validEventId,
          );
        } finally {
          if (
            runtime
          ) {
            await runtime.stop();
          }

          if (
            dlqObserver
          ) {
            await dlqObserver.stop();
          }

          await admin.deleteTopics({
            topics: [
              sourceTopic,
              dlqTopic,
            ],
          });
        }
      },
      40_000,
    );

    it(
      "moves an unsupported event version to DLQ and continues processing the next event",
      async () => {
        const sourceTopic =
          `identity.events.dlq-invalid-version-${randomUUID()}`;

        const dlqTopic =
          `${sourceTopic}.dlq`;

        const invalidUserId =
          randomUUID();

        const validUserId =
          randomUUID();

        const invalidEventId =
          randomUUID();

        const validEventId =
          randomUUID();

        let runtime:
          | ProfileEventsConsumerRuntime
          | undefined;

        let dlqObserver:
          | DlqObserver
          | undefined;

        try {
          await createTopics(
            admin,
            sourceTopic,
            dlqTopic,
          );

          runtime =
            await startProfileEventsConsumer(
              prisma,
              {
                topic:
                  sourceTopic,

                dlqTopic,

                groupId:
                  `profile-dlq-invalid-version-${randomUUID()}`,

                fromBeginning:
                  true,

                waitForReady:
                  true,

                readyTimeoutMs:
                  10_000,
              },
            );

          const invalidEvent = {
            eventId:
              invalidEventId,

            eventType:
              "identity.user.created" as const,

            version:
              2,

            producer:
              "identity-service",

            occurredAt:
              new Date().toISOString(),

            aggregateId:
              invalidUserId,

            payload: {
              userId:
                invalidUserId,

              email:
                `${invalidUserId}@dlq.test`,

              accountType:
                "TALENT" as const,
            },
          };

          const validEvent = {
            eventId:
              validEventId,

            eventType:
              "identity.user.created" as const,

            version:
              1,

            producer:
              "identity-service",

            occurredAt:
              new Date().toISOString(),

            aggregateId:
              validUserId,

            payload: {
              userId:
                validUserId,

              email:
                `${validUserId}@dlq.test`,

              accountType:
                "TALENT" as const,
            },
          };

          /*
           * Same partition, different users.
           *
           * This gives us a real proof that:
           *
           * V2 invalid
           *   -> DLQ
           *   -> offset advances
           *   -> V1 next event succeeds
           */
          await producer.send({
            topic:
              sourceTopic,

            messages: [
              {
                partition:
                  0,

                key:
                  invalidUserId,

                value:
                  JSON.stringify(
                    invalidEvent,
                  ),
              },

              {
                partition:
                  0,

                key:
                  validUserId,

                value:
                  JSON.stringify(
                    validEvent,
                  ),
              },
            ],
          });

          /*
           * Wait for the valid projection first.
           *
           * If the invalid event blocks the partition,
           * this condition will never become true.
           */
          await waitFor(
            async () => {
              const account =
                await prisma.account.findUnique({
                  where: {
                    userId:
                      validUserId,
                  },
                });

              return (
                account !==
                null
              );
            },
          );

          /*
           * The source consumer already processed
           * both messages by this point.
           *
           * Read the DLQ from the beginning so we
           * cannot lose the message because of a
           * consumer-start race.
           */
          dlqObserver =
            await startDlqObserver(
              dlqTopic,
            );

          await waitFor(
            async () => {
              return dlqObserver!.messages.some(
                (
                  message,
                ) =>
                  message.reason ===
                    "INVALID_EVENT" &&
                  message.source.topic ===
                    sourceTopic &&
                  message.source.partition ===
                    0 &&
                  message.source.key ===
                    invalidUserId &&
                  message.rawValue ===
                    JSON.stringify(
                      invalidEvent,
                    ),
              );
            },
          );

          const deadLetter =
            dlqObserver.messages.find(
              (
                message,
              ) =>
                message.reason ===
                  "INVALID_EVENT" &&
                message.source.topic ===
                  sourceTopic &&
                message.source.partition ===
                  0 &&
                message.source.key ===
                  invalidUserId,
            );

          expect(
            deadLetter,
          ).toBeDefined();

          expect(
            deadLetter?.version,
          ).toBe(1);

          expect(
            deadLetter?.eventType,
          ).toBe(
            "profile.event.dead_lettered",
          );

          expect(
            deadLetter?.rawValue,
          ).toBe(
            JSON.stringify(
              invalidEvent,
            ),
          );

          /*
           * The V2 event must never create
           * any projection.
           */
          const invalidAccount =
            await prisma.account.findUnique({
              where: {
                userId:
                  invalidUserId,
              },
            });

          expect(
            invalidAccount,
          ).toBeNull();

          const invalidProcessedEvent =
            await prisma.processedEvent.findUnique({
              where: {
                eventId:
                  invalidEventId,
              },
            });

          expect(
            invalidProcessedEvent,
          ).toBeNull();

          /*
           * The V1 event that followed it on
           * the SAME partition must be projected.
           */
          const validAccount =
            await prisma.account.findUnique({
              where: {
                userId:
                  validUserId,
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
            validAccount,
          ).not.toBeNull();

          expect(
            validAccount?.type,
          ).toBe(
            "TALENT",
          );

          expect(
            validAccount?.profile,
          ).not.toBeNull();

          expect(
            validAccount?.talentProfile,
          ).not.toBeNull();

          expect(
            validAccount?.professionalProfile,
          ).toBeNull();

          const validProcessedEvent =
            await prisma.processedEvent.findUnique({
              where: {
                eventId:
                  validEventId,
              },
            });

          expect(
            validProcessedEvent,
          ).not.toBeNull();

          await cleanupProjection(
            validUserId,
            validEventId,
          );
        } finally {
          if (
            runtime
          ) {
            await runtime.stop();
          }

          if (
            dlqObserver
          ) {
            await dlqObserver.stop();
          }

          await admin.deleteTopics({
            topics: [
              sourceTopic,
              dlqTopic,
            ],
          });
        }
      },
      40_000,
    );
  },
);