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

import { prisma } from "../../../src/infrastructure/database/prisma";
import { kafka } from "../../../src/infrastructure/kafka/kafka-client";
import { KafkaEventPublisher } from "../../../src/infrastructure/kafka/kafka-event-publisher";
import { OutboxPublisher } from "../../../src/application/outbox/outbox-publisher";

const topic =
  process.env.KAFKA_TOPIC_IDENTITY_EVENTS ??
  "identity.events";

const groupId = `identity-test-${process.pid}-${Date.now()}`;

describe("Kafka Outbox Publisher", () => {
  let consumer: Consumer;
  let eventPublisher: KafkaEventPublisher;

  beforeAll(async () => {
    await prisma.$connect();

    consumer = kafka.consumer({
      groupId,
    });

    await consumer.connect();

    await consumer.subscribe({
      topic,
      fromBeginning: true,
    });

    eventPublisher = new KafkaEventPublisher();
  });

  beforeEach(async () => {
    await prisma.outboxEvent.deleteMany();
  });

  afterAll(async () => {
    await eventPublisher.disconnect();

    if (consumer) {
      await consumer.stop();
      await consumer.disconnect();
    }

    await prisma.$disconnect();
  });

  it(
    "publishes an outbox event to Kafka",
    async () => {
      const aggregateId = crypto.randomUUID();
      const userId = crypto.randomUUID();
      const eventId = crypto.randomUUID();

      const outboxEvent =
        await prisma.outboxEvent.create({
          data: {
            eventId,
            eventType:
              "identity.user.created",
            aggregateType: "User",
            aggregateId,
            payload: {
              userId,
              email: "kafka@example.com",
            },
          },
        });

      const receivedEventPromise =
        new Promise<Record<string, unknown>>(
          async (resolve, reject) => {
            let resolved = false;

            const timeout = setTimeout(() => {
              if (!resolved) {
                reject(
                  new Error(
                    "Timed out waiting for Kafka event",
                  ),
                );
              }
            }, 10_000);

            try {
              await consumer.run({
                eachMessage: async ({
                  message,
                }: EachMessagePayload) => {
                  if (!message.value) {
                    return;
                  }

                  try {
                    const event =
                      JSON.parse(
                        message.value.toString(),
                      ) as Record<string, unknown>;

                    if (
                      event.eventId !== eventId
                    ) {
                      return;
                    }

                    resolved = true;
                    clearTimeout(timeout);
                    resolve(event);
                  } catch (error) {
                    clearTimeout(timeout);
                    reject(error);
                  }
                },
              });
            } catch (error) {
              clearTimeout(timeout);
              reject(error);
            }
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

      const receivedEvent =
        await receivedEventPromise;

      expect(receivedEvent.eventId).toBe(
        eventId,
      );

      expect(receivedEvent.eventType).toBe(
        "identity.user.created",
      );

      expect(receivedEvent.version).toBe(1);

      expect(receivedEvent.producer).toBe(
        "identity-service",
      );

      expect(
        receivedEvent.aggregateId,
      ).toBe(aggregateId);

      expect(receivedEvent.payload).toEqual({
        userId,
        email: "kafka@example.com",
      });

      const updated =
        await prisma.outboxEvent.findUnique({
          where: {
            id: outboxEvent.id,
          },
        });

      expect(
        updated?.publishedAt,
      ).not.toBeNull();

      expect(updated?.attempts).toBe(1);
    },
    15_000,
  );
});