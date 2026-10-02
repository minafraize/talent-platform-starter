import { randomUUID } from "node:crypto";

import { Kafka, type Producer } from "kafkajs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "../../src/infrastructure/database/prisma.js";
import {
  startProfileEventsConsumer,
  type ProfileEventsConsumerRuntime,
} from "../../src/infrastructure/kafka/profile-events.consumer.js";

const brokers = (
  process.env.KAFKA_BROKERS ??
  "localhost:9092"
).split(",");

const topic =
  process.env.KAFKA_IDENTITY_TOPIC ??
  "identity.events";

const kafka = new Kafka({
  clientId: "profile-integration-tests",
  brokers,
});

let producer: Producer;
let consumerRuntime: ProfileEventsConsumerRuntime;

async function waitFor(
  condition: () => Promise<boolean>,
  timeoutMs = 15_000,
  intervalMs = 250,
): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await condition()) {
      return;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, intervalMs);
    });
  }

  throw new Error(
    `Condition was not satisfied within ${timeoutMs}ms`,
  );
}

describe(
  "identity.user.created Kafka integration",
  () => {
    beforeAll(async () => {
      producer = kafka.producer();

      await producer.connect();

      consumerRuntime = await startProfileEventsConsumer(prisma, {
        topic,
        groupId: `profile-integration-${randomUUID()}`,
        fromBeginning: false,
        waitForReady: true,
        readyTimeoutMs: 10_000,
      });
    });

    afterAll(async () => {
      await consumerRuntime.stop();
      await producer.disconnect();
      await prisma.$disconnect();
    });

    it.each([
      {
        accountType: "USER" as const,
        expectedTalent: false,
        expectedProfessional: false,
      },
      {
        accountType: "TALENT" as const,
        expectedTalent: true,
        expectedProfessional: false,
      },
      {
        accountType: "PROFESSIONAL" as const,
        expectedTalent: false,
        expectedProfessional: true,
      },
    ])(
      "creates the correct profile structure for $accountType",
      async ({
        accountType,
        expectedTalent,
        expectedProfessional,
      }) => {
        const eventId = randomUUID();
        const userId = randomUUID();

        const event = {
          eventId,
          eventType:
            "identity.user.created" as const,

          version: 1,
          producer: "identity-service",
          occurredAt:
            new Date().toISOString(),

          aggregateId: userId,

          payload: {
            version: 1,
            producer: "identity-service",
            occurredAt:
              new Date().toISOString(),

            userId,
            accountType,
            email: `${userId}@integration.test`,
          },
        };

        await producer.send({
          topic,
          messages: [
            {
              key: userId,
              value: JSON.stringify(event),
            },
          ],
        });

        await waitFor(async () => {
          const account =
            await prisma.account.findUnique({
              where: {
                userId,
              },
            });

          return account !== null;
        });

        const account =
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

        expect(account).not.toBeNull();

        expect(account?.type).toBe(
          accountType,
        );

        expect(account?.status).toBe(
          "ACTIVE",
        );

        expect(account?.profile).not.toBeNull();

        expect(
          account?.talentProfile !== null,
        ).toBe(expectedTalent);

        expect(
          account?.professionalProfile !==
            null,
        ).toBe(expectedProfessional);

        const processedEvent =
          await prisma.processedEvent.findUnique(
            {
              where: {
                eventId,
              },
            },
          );

        expect(processedEvent).not.toBeNull();
        expect(
          processedEvent?.eventType,
        ).toBe("identity.user.created");

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

    it("ignores duplicate delivery of the same event", async () => {
        const eventId = randomUUID();

        const firstUserId = randomUUID();
        const secondUserId = randomUUID();

        const occurredAt = new Date().toISOString();

        const firstEvent = {
            eventId,
            eventType:
            "identity.user.created" as const,

            version: 1,
            producer: "identity-service",
            occurredAt,

            aggregateId: firstUserId,

            payload: {
            version: 1,
            producer: "identity-service",
            occurredAt,

            userId: firstUserId,
            accountType: "TALENT" as const,
            email: `${firstUserId}@integration.test`,
            },
        };

        const secondEvent = {
            eventId: randomUUID(),
            eventType:
            "identity.user.created" as const,

            version: 1,
            producer: "identity-service",
            occurredAt,

            aggregateId: secondUserId,

            payload: {
            version: 1,
            producer: "identity-service",
            occurredAt,

            userId: secondUserId,
            accountType: "TALENT" as const,
            email: `${secondUserId}@integration.test`,
            },
        };

        /**
         * Same event delivered twice,
         * followed by a sentinel event on
         * the same Kafka partition.
         *
         * Waiting for secondUserId proves
         * the duplicate was consumed before
         * the sentinel event.
         */
        await producer.send({
            topic,
            messages: [
            {
                key: "idempotency-test",
                value: JSON.stringify(firstEvent),
            },
            {
                key: "idempotency-test",
                value: JSON.stringify(firstEvent),
            },
            {
                key: "idempotency-test",
                value: JSON.stringify(secondEvent),
            },
            ],
        });

        await waitFor(async () => {
            const account =
            await prisma.account.findUnique({
                where: {
                userId: secondUserId,
                },
            });

            return account !== null;
        });

        const firstAccount =
            await prisma.account.findUnique({
            where: {
                userId: firstUserId,
            },
            });

        const firstAccountCount =
            await prisma.account.count({
            where: {
                userId: firstUserId,
            },
            });

        const firstProcessedEventCount =
            await prisma.processedEvent.count({
            where: {
                eventId,
            },
            });

        expect(firstAccount).not.toBeNull();

        expect(firstAccountCount).toBe(1);

        expect(firstProcessedEventCount).toBe(1);

        const firstProfile =
            await prisma.profile.findUnique({
            where: {
                accountId: firstAccount!.id,
            },
            });

        expect(firstProfile).not.toBeNull();

        const firstTalentProfile =
            await prisma.talentProfile.findUnique({
            where: {
                accountId: firstAccount!.id,
            },
            });

        expect(firstTalentProfile).not.toBeNull();

        /**
         * Sentinel event must also have been processed.
         */
        const secondAccount =
            await prisma.account.findUnique({
            where: {
                userId: secondUserId,
            },
            });

        expect(secondAccount).not.toBeNull();

        const processedEvents =
            await prisma.processedEvent.count({
            where: {
                eventId: {
                in: [
                    eventId,
                    secondEvent.eventId,
                ],
                },
            },
            });

        expect(processedEvents).toBe(2);

        /**
         * Cleanup.
         */
        await prisma.account.delete({
            where: {
            userId: firstUserId,
            },
        });

        await prisma.account.delete({
            where: {
            userId: secondUserId,
            },
        });

        await prisma.processedEvent.deleteMany({
            where: {
            eventId: {
                in: [
                eventId,
                secondEvent.eventId,
                ],
            },
            },
        });
    },
     15_000,
    );
  },
);