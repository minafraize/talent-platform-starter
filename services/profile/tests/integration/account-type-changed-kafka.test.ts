import { randomUUID } from "node:crypto";

import { Kafka, type Producer } from "kafkajs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  AccountTypeChangedEventSchema,
  type AccountTypeChangedEvent,
} from "@talent/event-schemas";

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
  clientId: "profile-account-type-integration-tests",
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

function buildEvent(input: {
  userId: string;
  previousAccountType: "USER" | "TALENT" | "PROFESSIONAL";
  newAccountType: "USER" | "TALENT" | "PROFESSIONAL";
}): AccountTypeChangedEvent {
  const event = {
    eventId: randomUUID(),
    eventType: "identity.account.type.changed" as const,
    version: 1 as const,
    producer: "identity-service" as const,
    occurredAt: new Date().toISOString(),
    aggregateId: input.userId,
    payload: {
      userId: input.userId,
      previousAccountType: input.previousAccountType,
      newAccountType: input.newAccountType,
    },
  };

  return AccountTypeChangedEventSchema.parse(event);
}

async function createAccount(
  userId: string,
  type: "USER" | "TALENT" | "PROFESSIONAL",
): Promise<void> {
  await prisma.account.create({
    data: {
      userId,
      type,
      status: "ACTIVE",
      profile: {
        create: {},
      },
      ...(type === "TALENT"
        ? {
            talentProfile: {
              create: {
                status: "ACTIVE",
                score: 25,
              },
            },
          }
        : {}),
      ...(type === "PROFESSIONAL"
        ? {
            professionalProfile: {
              create: {
                headline: "Integration test professional",
              },
            },
          }
        : {}),
    },
  });
}

async function cleanup(
  userIds: string[],
  eventIds: string[],
): Promise<void> {
  await prisma.account.deleteMany({
    where: {
      userId: { in: userIds },
    },
  });

  await prisma.processedEvent.deleteMany({
    where: {
      eventId: { in: eventIds },
    },
  });
}

describe(
  "identity.account.type.changed Kafka integration",
  () => {
    beforeAll(async () => {
      producer = kafka.producer();
      await producer.connect();

      consumerRuntime = await startProfileEventsConsumer(
        prisma,
        {
          topic,
          groupId: `profile-account-type-integration-${randomUUID()}`,
          fromBeginning: false,
          waitForReady: true,
        },
      );
    });

    afterAll(async () => {
      await consumerRuntime.stop();
      await producer.disconnect();
      await prisma.$disconnect();
    });

    it("updates USER -> TALENT and creates TalentProfile", async () => {
      const userId = randomUUID();
      const event = buildEvent({
        userId,
        previousAccountType: "USER",
        newAccountType: "TALENT",
      });

      await createAccount(userId, "USER");

      await producer.send({
        topic,
        messages: [{
          key: userId,
          value: JSON.stringify(event),
        }],
      });

      await waitFor(async () => {
        const account = await prisma.account.findUnique({
          where: { userId },
          include: {
            talentProfile: true,
            professionalProfile: true,
          },
        });

        return account?.type === "TALENT" && account.talentProfile !== null;
      });

      const account = await prisma.account.findUnique({
        where: { userId },
        include: {
          talentProfile: true,
          professionalProfile: true,
        },
      });

      expect(account?.type).toBe("TALENT");
      expect(account?.talentProfile).not.toBeNull();
      expect(account?.talentProfile?.status).toBe("ACTIVE");
      expect(account?.talentProfile?.score).toBe(0);
      expect(account?.professionalProfile).toBeNull();

      const processedEvent = await prisma.processedEvent.findUnique({
        where: { eventId: event.eventId },
      });

      expect(processedEvent).not.toBeNull();
      expect(processedEvent?.eventType).toBe("identity.account.type.changed");

      await cleanup([userId], [event.eventId]);
    });

    it("updates USER -> PROFESSIONAL and creates ProfessionalProfile", async () => {
      const userId = randomUUID();
      const event = buildEvent({
        userId,
        previousAccountType: "USER",
        newAccountType: "PROFESSIONAL",
      });

      await createAccount(userId, "USER");

      await producer.send({
        topic,
        messages: [{
          key: userId,
          value: JSON.stringify(event),
        }],
      });

      await waitFor(async () => {
        const account = await prisma.account.findUnique({
          where: { userId },
          include: {
            talentProfile: true,
            professionalProfile: true,
          },
        });

        return account?.type === "PROFESSIONAL" && account.professionalProfile !== null;
      });

      const account = await prisma.account.findUnique({
        where: { userId },
        include: {
          talentProfile: true,
          professionalProfile: true,
        },
      });

      expect(account?.type).toBe("PROFESSIONAL");
      expect(account?.professionalProfile).not.toBeNull();
      expect(account?.professionalProfile?.headline).toBeNull();
      expect(account?.talentProfile).toBeNull();

      await cleanup([userId], [event.eventId]);
    });

    it("converts TALENT -> PROFESSIONAL", async () => {
      const userId = randomUUID();
      const event = buildEvent({
        userId,
        previousAccountType: "TALENT",
        newAccountType: "PROFESSIONAL",
      });

      await createAccount(userId, "TALENT");

      await producer.send({
        topic,
        messages: [{
          key: userId,
          value: JSON.stringify(event),
        }],
      });

      await waitFor(async () => {
        const account = await prisma.account.findUnique({
          where: { userId },
          include: {
            talentProfile: true,
            professionalProfile: true,
          },
        });

        return account?.type === "PROFESSIONAL" &&
          account.talentProfile === null &&
          account.professionalProfile !== null;
      });

      const account = await prisma.account.findUnique({
        where: { userId },
        include: {
          talentProfile: true,
          professionalProfile: true,
        },
      });

      expect(account?.type).toBe("PROFESSIONAL");
      expect(account?.talentProfile).toBeNull();
      expect(account?.professionalProfile).not.toBeNull();
      expect(account?.professionalProfile?.headline).toBeNull();

      await cleanup([userId], [event.eventId]);
    });

    it("ignores duplicate delivery of the same event", async () => {
      const firstUserId = randomUUID();
      const secondUserId = randomUUID();

      const firstEvent = buildEvent({
        userId: firstUserId,
        previousAccountType: "USER",
        newAccountType: "TALENT",
      });
      const secondEvent = buildEvent({
        userId: secondUserId,
        previousAccountType: "USER",
        newAccountType: "TALENT",
      });

      await createAccount(firstUserId, "USER");
      await createAccount(secondUserId, "USER");

      await producer.send({
        topic,
        messages: [
          {
            key: "account-type-idempotency-test",
            value: JSON.stringify(firstEvent),
          },
          {
            key: "account-type-idempotency-test",
            value: JSON.stringify(firstEvent),
          },
          {
            key: "account-type-idempotency-test",
            value: JSON.stringify(secondEvent),
          },
        ],
      });

      await waitFor(async () => {
        const account = await prisma.account.findUnique({
          where: { userId: secondUserId },
          include: { talentProfile: true },
        });

        return account?.type === "TALENT" && account.talentProfile !== null;
      });

      const firstAccount = await prisma.account.findUnique({
        where: { userId: firstUserId },
        include: {
          talentProfile: true,
          professionalProfile: true,
        },
      });

      expect(firstAccount?.type).toBe("TALENT");
      expect(firstAccount?.talentProfile).not.toBeNull();
      expect(firstAccount?.professionalProfile).toBeNull();

      const firstProcessedEventCount = await prisma.processedEvent.count({
        where: { eventId: firstEvent.eventId },
      });

      expect(firstProcessedEventCount).toBe(1);

      const secondProcessedEvent = await prisma.processedEvent.findUnique({
        where: { eventId: secondEvent.eventId },
      });

      expect(secondProcessedEvent).not.toBeNull();

      await cleanup(
        [firstUserId, secondUserId],
        [firstEvent.eventId, secondEvent.eventId],
      );
    });

    it(
      "ignores a stale event without blocking later events",
      async () => {
        const firstUserId =
          randomUUID();

        const secondUserId =
          randomUUID();

        /*
        * First account already exists
        * as TALENT.
        */
        await createAccount(
          firstUserId,
          "TALENT",
        );

        /*
        * This is the newer event.
        *
        * TALENT -> PROFESSIONAL
        */
        const newerEvent =
          buildEvent({
            userId:
              firstUserId,

            previousAccountType:
              "TALENT",

            newAccountType:
              "PROFESSIONAL",
          });

        /*
        * This is an older event.
        *
        * USER -> TALENT
        *
        * It arrives AFTER the newer
        * PROFESSIONAL event.
        */
        const staleEvent =
          buildEvent({
            userId:
              firstUserId,

            previousAccountType:
              "USER",

            newAccountType:
              "TALENT",
          });

        /*
        * Sentinel event.
        *
        * Same Kafka key as the previous
        * messages so it stays on the same
        * partition.
        *
        * If the stale event poisons the
        * consumer, this event will never
        * be processed.
        */
        await createAccount(
          secondUserId,
          "USER",
        );

        const sentinelEvent =
          buildEvent({
            userId:
              secondUserId,

            previousAccountType:
              "USER",

            newAccountType:
              "TALENT",
          });

        await producer.send({
          topic,

          messages: [
            {
              key:
                firstUserId,

              value:
                JSON.stringify(
                  newerEvent,
                ),
            },

            {
              key:
                firstUserId,

              value:
                JSON.stringify(
                  staleEvent,
                ),
            },

            {
              key:
                firstUserId,

              value:
                JSON.stringify(
                  sentinelEvent,
                ),
            },
          ],
        });

        /*
        * Wait until the first account
        * reaches PROFESSIONAL.
        */
        await waitFor(
          async () => {
            const account =
              await prisma.account.findUnique(
                {
                  where: {
                    userId:
                      firstUserId,
                  },

                  include: {
                    talentProfile: true,
                    professionalProfile:
                      true,
                  },
                },
              );

            return (
              account?.type ===
                "PROFESSIONAL" &&
              account.talentProfile ===
                null &&
              account.professionalProfile !==
                null
            );
          },
        );

        /*
        * The stale event must have been
        * acknowledged.
        */
        await waitFor(
          async () => {
            const processedEvent =
              await prisma.processedEvent.findUnique(
                {
                  where: {
                    eventId:
                      staleEvent.eventId,
                  },
                },
              );

            return (
              processedEvent !==
              null
            );
          },
        );

        /*
        * Most important assertion:
        *
        * The stale event must NOT
        * regress the account.
        */
        const firstAccount =
          await prisma.account.findUnique(
            {
              where: {
                userId:
                  firstUserId,
              },

              include: {
                talentProfile:
                  true,

                professionalProfile:
                  true,
              },
            },
          );

        expect(
          firstAccount?.type,
        ).toBe("PROFESSIONAL");

        expect(
          firstAccount?.talentProfile,
        ).toBeNull();

        expect(
          firstAccount?.professionalProfile,
        ).not.toBeNull();

        /*
        * The sentinel event must also
        * be processed.
        *
        * This proves that the stale
        * event did not poison the Kafka
        * partition.
        */
        await waitFor(
          async () => {
            const secondAccount =
              await prisma.account.findUnique(
                {
                  where: {
                    userId:
                      secondUserId,
                  },
                },
              );

            return (
              secondAccount?.type ===
              "TALENT"
            );
          },
        );

        const newerProcessed =
          await prisma.processedEvent.findUnique(
            {
              where: {
                eventId:
                  newerEvent.eventId,
              },
            },
          );

        const staleProcessed =
          await prisma.processedEvent.findUnique(
            {
              where: {
                eventId:
                  staleEvent.eventId,
              },
            },
          );

        const sentinelProcessed =
          await prisma.processedEvent.findUnique(
            {
              where: {
                eventId:
                  sentinelEvent.eventId,
              },
            },
          );

        expect(
          newerProcessed,
        ).not.toBeNull();

        expect(
          staleProcessed,
        ).not.toBeNull();

        expect(
          sentinelProcessed,
        ).not.toBeNull();

        await cleanup(
          [
            firstUserId,
            secondUserId,
          ],
          [
            newerEvent.eventId,
            staleEvent.eventId,
            sentinelEvent.eventId,
          ],
        );
      },
    );
  },
);
