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

import {
  prisma,
} from "../../../src/infrastructure/database/prisma.js";

import {
  startProfileEventsConsumer,
} from "../../../src/infrastructure/kafka/profile-events.consumer.js";

import type {
  ProfileEventsConsumerRuntime,
} from "../../../src/infrastructure/kafka/profile-events.consumer.js";

import {
  ProfileDlqReplayService,
} from "../../../src/infrastructure/kafka/profile-dlq-replay.js";

import {
  createProfileDeadLetterRecord,
} from "../../../src/infrastructure/kafka/profile-event-dlq.js";

const brokers = (
  process.env.KAFKA_BROKERS ??
  "localhost:9092"
).split(",");

const kafka =
  new Kafka({
    clientId:
      `profile-dlq-replay-tests-${randomUUID()}`,

    brokers,
  });

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

describe(
  "Profile Kafka DLQ Replay",
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
      "replays a DLQ event to the original source partition and remains idempotent",
      async () => {
        const sourceTopic =
          `identity.events.replay-${randomUUID()}`;

        const dlqTopic =
          `${sourceTopic}.dlq`;

        const userId =
          randomUUID();

        const eventId =
          randomUUID();

        let runtime:
          | ProfileEventsConsumerRuntime
          | undefined;

        try {
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

          runtime =
            await startProfileEventsConsumer(
              prisma,
              {
                topic:
                  sourceTopic,

                dlqTopic,

                groupId:
                  `profile-replay-${randomUUID()}`,

                fromBeginning:
                  true,

                waitForReady:
                  true,

                readyTimeoutMs:
                  10_000,
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
                `${userId}@replay.test`,

              accountType:
                "TALENT" as const,
            },
          };

          const rawValue =
            JSON.stringify(
              event,
            );

          const deadLetter =
            createProfileDeadLetterRecord({
              reason:
                "INVALID_EVENT",

              error:
                "Simulated transient failure requiring replay",

              topic:
                sourceTopic,

              partition:
                0,

              offset:
                "17",

              key:
                userId,

              timestamp:
                new Date().toISOString(),

              rawValue,
            });

          await producer.send({
            topic:
              dlqTopic,

            messages: [
              {
                partition:
                  0,

                key:
                  userId,

                value:
                  JSON.stringify(
                    deadLetter,
                  ),
              },
            ],
          });

          const replayService =
            new ProfileDlqReplayService(
              prisma,
              kafka,
            );

          const firstReplay =
            await replayService.replay(
              dlqTopic,

              {
                eventId,
              },
            );

          expect(
            firstReplay.status,
          ).toBe(
            "REPLAYED",
          );

          expect(
            firstReplay.eventId,
          ).toBe(
            eventId,
          );

          expect(
            firstReplay.sourceTopic,
          ).toBe(
            sourceTopic,
          );

          expect(
            firstReplay.sourcePartition,
          ).toBe(
            0,
          );

          expect(
            firstReplay.sourceOffset,
          ).toBe(
            "17",
          );

          expect(
            firstReplay.sourceKey,
          ).toBe(
            userId,
          );

          await waitFor(
            async () => {
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

              return (
                account !==
                null
              );
            },
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

          /*
           * Replay the exact same DLQ record again.
           *
           * ProcessedEvent should prevent another
           * business execution.
           */
          const secondReplay =
            await replayService.replay(
              dlqTopic,

              {
                eventId,
              },
            );

          expect(
            secondReplay.status,
          ).toBe(
            "ALREADY_PROCESSED",
          );

          const accounts =
            await prisma.account.count({
              where: {
                userId,
              },
            });

          expect(
            accounts,
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
        } finally {
          if (
            runtime
          ) {
            await runtime.stop();
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