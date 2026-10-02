import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  Consumer,
  type EachMessagePayload,
} from "kafkajs";

import {
  AccountTypeChangedEventSchema,
} from "@talent/event-schemas";

import {
  prisma,
} from "../../../src/infrastructure/database/prisma";

import {
  kafka,
} from "../../../src/infrastructure/kafka/kafka-client";

import {
  KafkaEventPublisher,
} from "../../../src/infrastructure/kafka/kafka-event-publisher";

import {
  OutboxPublisher,
} from "../../../src/application/outbox/outbox-publisher";

interface ReceivedKafkaMessage {
  key: string | null;
  event: Record<string, unknown>;
}

const topic =
  process.env.KAFKA_IDENTITY_TOPIC ??
  "identity.events";

const groupId =
  `identity-test-${process.pid}-${Date.now()}`;

describe(
  "Kafka Outbox Publisher",
  () => {
    let consumer: Consumer;
    let eventPublisher:
      KafkaEventPublisher;

    const receivedMessages:
      ReceivedKafkaMessage[] = [];

    beforeAll(async () => {
      await prisma.$connect();

      consumer =
        kafka.consumer({
          groupId,
        });

      await consumer.connect();

      await consumer.subscribe({
        topic,
        fromBeginning: false,
      });

      eventPublisher =
        new KafkaEventPublisher();

      await consumer.run({
        eachMessage: async ({
          message,
        }: EachMessagePayload) => {
          if (!message.value) {
            return;
          }

          const event =
            JSON.parse(
              message.value.toString(),
            ) as Record<
              string,
              unknown
            >;

          receivedMessages.push({
            key:
              message.key?.toString() ??
              null,

            event,
          });
        },
      });
    });

    beforeEach(async () => {
      await prisma.outboxEvent.deleteMany();
    });

    afterAll(async () => {
      if (consumer) {
        await consumer.stop();
        await consumer.disconnect();
      }

      if (eventPublisher) {
        await eventPublisher.disconnect();
      }

      await prisma.$disconnect();
    });

    async function waitForEvent(
      eventId: string,
      timeoutMs = 10_000,
      intervalMs = 100,
    ): Promise<ReceivedKafkaMessage> {
      const startedAt =
        Date.now();

      while (
        Date.now() - startedAt <
        timeoutMs
      ) {
        const received =
          receivedMessages.find(
            (message) =>
              message.event.eventId ===
              eventId,
          );

        if (received) {
          return received;
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
        `Timed out waiting for Kafka event ${eventId}`,
      );
    }

    it(
      "publishes an outbox event to Kafka",
      async () => {
        const aggregateId =
          crypto.randomUUID();

        const userId =
          crypto.randomUUID();

        const eventId =
          crypto.randomUUID();

        const outboxEvent =
          await prisma.outboxEvent.create(
            {
              data: {
                eventId,

                eventType:
                  "identity.user.created",

                aggregateType:
                  "User",

                aggregateId,

                payload: {
                  userId,
                  email:
                    "kafka@example.com",
                },
              },
            },
          );

        const outboxPublisher =
          new OutboxPublisher(
            prisma,
            eventPublisher,
            {
              topic,
            },
          );

        const count =
          await outboxPublisher.publishPending();

        expect(count).toBe(1);

        const received =
          await waitForEvent(
            eventId,
          );

        expect(
          received.key,
        ).toBe(aggregateId);

        expect(
          received.event.eventId,
        ).toBe(eventId);

        expect(
          received.event.eventType,
        ).toBe(
          "identity.user.created",
        );

        expect(
          received.event.version,
        ).toBe(1);

        expect(
          received.event.producer,
        ).toBe(
          "identity-service",
        );

        expect(
          received.event.aggregateId,
        ).toBe(aggregateId);

        expect(
          received.event.payload,
        ).toEqual({
          userId,
          email:
            "kafka@example.com",
        });

        const updated =
          await prisma.outboxEvent.findUnique(
            {
              where: {
                id: outboxEvent.id,
              },
            },
          );

        expect(
          updated?.publishedAt,
        ).not.toBeNull();

        expect(
          updated?.attempts,
        ).toBe(1);
      },
      15_000,
    );

    it(
      "publishes account type changed events using the shared contract",
      async () => {
        const userId =
          crypto.randomUUID();

        const eventId =
          crypto.randomUUID();

        const outboxEvent =
          await prisma.outboxEvent.create(
            {
              data: {
                eventId,

                eventType:
                  "identity.account.type.changed",

                aggregateType:
                  "User",

                aggregateId:
                  userId,

                payload: {
                  userId,

                  previousAccountType:
                    "USER",

                  newAccountType:
                    "TALENT",
                },
              },
            },
          );

        const outboxPublisher =
          new OutboxPublisher(
            prisma,
            eventPublisher,
            {
              topic,
            },
          );

        const count =
          await outboxPublisher.publishPending();

        expect(count).toBe(1);

        const received =
          await waitForEvent(
            eventId,
          );

        /*
         * The Kafka key must be the
         * aggregateId.
         */
        expect(
          received.key,
        ).toBe(userId);

        /*
         * Validate the complete
         * cross-service event contract.
         */
        const parsedEvent =
          AccountTypeChangedEventSchema.parse(
            received.event,
          );

        expect(
          parsedEvent.eventId,
        ).toBe(eventId);

        expect(
          parsedEvent.eventType,
        ).toBe(
          "identity.account.type.changed",
        );

        expect(
          parsedEvent.version,
        ).toBe(1);

        expect(
          parsedEvent.producer,
        ).toBe(
          "identity-service",
        );

        expect(
          parsedEvent.aggregateId,
        ).toBe(userId);

        expect(
          parsedEvent.payload,
        ).toEqual({
          userId,

          previousAccountType:
            "USER",

          newAccountType:
            "TALENT",
        });

        const updated =
          await prisma.outboxEvent.findUnique(
            {
              where: {
                id: outboxEvent.id,
              },
            },
          );

        expect(
          updated?.publishedAt,
        ).not.toBeNull();

        expect(
          updated?.attempts,
        ).toBe(1);
      },
      15_000,
    );
  },
);