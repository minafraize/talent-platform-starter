import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  prisma,
} from "../../../src/infrastructure/database/prisma";

import {
  OutboxPublisher,
} from "../../../src/application/outbox/outbox-publisher";

import type {
  EventPublisher,
  PublishEventInput,
} from "../../../src/application/ports/event-publisher";
import { OutboxRetryPolicy } from "../../../src/application/outbox/retry-policy";

describe("OutboxPublisher", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.outboxEvent.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("publishes unpublished events and marks them as published", async () => {
    const publishedEvents: PublishEventInput[] = [];

    const publisher: EventPublisher = {
      async publish(input) {
        publishedEvents.push(input);
      },
    };

    const event = await prisma.outboxEvent.create({
      data: {
        eventId: crypto.randomUUID(),
        eventType: "identity.user.created",
        aggregateType: "User",
        aggregateId: crypto.randomUUID(),
        payload: {
          userId: crypto.randomUUID(),
          email: "mina@example.com",
        },
      },
    });

    const outboxPublisher =
      new OutboxPublisher(
        prisma,
        publisher,
        {
          topic: "identity.events",
        },
      );

    const count =
      await outboxPublisher.publishPending();

    expect(count).toBe(1);

    expect(
      publishedEvents,
    ).toHaveLength(1);

    expect(
      publishedEvents[0]?.topic,
    ).toBe("identity.events");

    expect(
      publishedEvents[0]?.key,
    ).toBe(event.aggregateId);

    const updated =
      await prisma.outboxEvent.findUnique({
        where: {
          id: event.id,
        },
      });

    expect(updated?.publishedAt).not.toBeNull();
    expect(updated?.attempts).toBe(1);
  });

  it("keeps event unpublished when publishing fails", async () => {
    const publisher: EventPublisher = {
      async publish() {
        throw new Error("KAFKA_UNAVAILABLE");
      },
    };

    const event = await prisma.outboxEvent.create({
      data: {
        eventId: crypto.randomUUID(),
        eventType: "identity.user.created",
        aggregateType: "User",
        aggregateId: crypto.randomUUID(),
        payload: {
          userId: crypto.randomUUID(),
          email: "failure@example.com",
        },
      },
    });

    const outboxPublisher = new OutboxPublisher(
      prisma,
      publisher,
      {
        topic: "identity.events",
        workerId: "failure-worker",
      },
    );

    const count = await outboxPublisher.publishPending();

    // A failed publish should not cause the whole batch
    // operation to reject.
    expect(count).toBe(0);

    const updated = await prisma.outboxEvent.findUnique({
      where: {
        id: event.id,
      },
    });

    expect(updated).not.toBeNull();

    expect(updated?.publishedAt).toBeNull();

    expect(updated?.attempts).toBe(1);

    expect(updated?.lastError).toBe(
      "KAFKA_UNAVAILABLE",
    );

    expect(updated?.failedAt).toBeNull();

    expect(updated?.nextAttemptAt).not.toBeNull();

    expect(updated?.claimedAt).toBeNull();

    expect(updated?.claimedBy).toBeNull();
  });

  it("does not publish the same event from two workers", async () => {
    const publishedEventIds: string[] = [];

    const publisher: EventPublisher = {
      async publish(input) {
        const event = input.event as {
          eventId: string;
        };

        await new Promise((resolve) =>
          setTimeout(resolve, 100),
        );

        publishedEventIds.push(
          event.eventId,
        );
      },
    };

    const event =
      await prisma.outboxEvent.create({
        data: {
          eventId: crypto.randomUUID(),
          eventType:
            "identity.user.created",
          aggregateType: "User",
          aggregateId:
            crypto.randomUUID(),
          payload: {
            userId:
              crypto.randomUUID(),
            email:
              "concurrent-worker@example.com",
          },
        },
      });

    const workerA =
      new OutboxPublisher(
        prisma,
        publisher,
        {
          topic: "identity.events",
          workerId: "worker-a",
          batchSize: 1,
        },
      );

    const workerB =
      new OutboxPublisher(
        prisma,
        publisher,
        {
          topic: "identity.events",
          workerId: "worker-b",
          batchSize: 1,
        },
      );

    await Promise.all([
      workerA.publishPending(),
      workerB.publishPending(),
    ]);

    expect(
      publishedEventIds.filter(
        (id) => id === event.eventId,
      ),
    ).toHaveLength(1);
  });

  it("schedules retry after publishing failure", async () => {
    let publishAttempts = 0;

    const publisher: EventPublisher = {
      async publish() {
        publishAttempts++;

        throw new Error(
          "TEMPORARY_KAFKA_FAILURE",
        );
      },
    };

    const event =
      await prisma.outboxEvent.create({
        data: {
          eventId: crypto.randomUUID(),
          eventType:
            "identity.user.created",
          aggregateType: "User",
          aggregateId:
            crypto.randomUUID(),
          payload: {
            userId:
              crypto.randomUUID(),
            email:
              "retry-policy@example.com",
          },
        },
      });

    const retryPolicy =
      new OutboxRetryPolicy({
        baseDelayMs: 100,
        maxDelayMs: 1_000,
        jitterRatio: 0,
      });

    const publisherService =
      new OutboxPublisher(
        prisma,
        publisher,
        {
          topic: "identity.events",
          retryPolicy,
          workerId: "retry-worker",
        },
      );

    const count =
      await publisherService.publishPending();

    expect(count).toBe(0);
    expect(publishAttempts).toBe(1);

    const updated =
      await prisma.outboxEvent.findUnique({
        where: {
          id: event.id,
        },
      });

    expect(updated?.publishedAt).toBeNull();
    expect(updated?.attempts).toBe(1);
    expect(updated?.lastError).toBe(
      "TEMPORARY_KAFKA_FAILURE",
    );
    expect(updated?.failedAt).toBeNull();
    expect(updated?.nextAttemptAt).not.toBeNull();
    expect(updated?.claimedBy).toBeNull();
    expect(updated?.claimedAt).toBeNull();
  });

  it("marks event as failed after max attempts", async () => {
    const publisher: EventPublisher = {
      async publish() {
        throw new Error(
          "PERMANENT_KAFKA_FAILURE",
        );
      },
    };

    const retryPolicy =
      new OutboxRetryPolicy({
        baseDelayMs: 1,
        maxDelayMs: 10,
        jitterRatio: 0,
        maxAttempts: 3,
      });

    const event =
      await prisma.outboxEvent.create({
        data: {
          eventId: crypto.randomUUID(),
          eventType:
            "identity.user.created",
          aggregateType: "User",
          aggregateId:
            crypto.randomUUID(),
          payload: {
            userId:
              crypto.randomUUID(),
            email:
              "dead-event@example.com",
          },
        },
      });

    const publisherService =
      new OutboxPublisher(
        prisma,
        publisher,
        {
          topic: "identity.events",
          retryPolicy,
          workerId: "dead-worker",
        },
      );

    await publisherService.publishPending();

    let updated =
      await prisma.outboxEvent.findUnique({
        where: {
          id: event.id,
        },
      });

    expect(updated?.attempts).toBe(1);
    expect(updated?.failedAt).toBeNull();

    await prisma.outboxEvent.update({
      where: {
        id: event.id,
      },
      data: {
        nextAttemptAt: new Date(0),
      },
    });

    await publisherService.publishPending();

    updated =
      await prisma.outboxEvent.findUnique({
        where: {
          id: event.id,
        },
      });

    expect(updated?.attempts).toBe(2);
    expect(updated?.failedAt).toBeNull();

    await prisma.outboxEvent.update({
      where: {
        id: event.id,
      },
      data: {
        nextAttemptAt: new Date(0),
      },
    });

    await publisherService.publishPending();

    updated =
      await prisma.outboxEvent.findUnique({
        where: {
          id: event.id,
        },
      });

    expect(updated?.attempts).toBe(3);
    expect(updated?.failedAt).not.toBeNull();
    expect(updated?.nextAttemptAt).toBeNull();
    expect(updated?.claimedBy).toBeNull();
    expect(updated?.claimedAt).toBeNull();
  });

  it(
    "does not publish a later event while an earlier event is still pending",
    async () => {
      const aggregateId =
        crypto.randomUUID();

      const firstEventId =
        crypto.randomUUID();

      const secondEventId =
        crypto.randomUUID();

      const firstCreatedAt =
        new Date("2026-10-01T20:00:00.000Z");

      const secondCreatedAt =
        new Date("2026-10-01T20:00:01.000Z");

      await prisma.outboxEvent.create({
        data: {
          eventId: firstEventId,
          eventType:
            "identity.account.type.changed",
          aggregateType: "User",
          aggregateId,
          createdAt: firstCreatedAt,
          payload: {
            userId: aggregateId,
            previousAccountType:
              "USER",
            newAccountType:
              "TALENT",
          },
        },
      });

      await prisma.outboxEvent.create({
        data: {
          eventId: secondEventId,
          eventType:
            "identity.account.type.changed",
          aggregateType: "User",
          aggregateId,
          createdAt: secondCreatedAt,
          payload: {
            userId: aggregateId,
            previousAccountType:
              "TALENT",
            newAccountType:
              "PROFESSIONAL",
          },
        },
      });

      const publishedEventIds: string[] = [];

      let releaseFirstPublish:
        (() => void) | undefined;

      const firstPublishStarted =
        new Promise<void>((resolve) => {
          releaseFirstPublish =
            resolve;
        });

      const publisher: EventPublisher = {
        async publish(input) {
          const event =
            input.event as {
              eventId: string;
            };

          if (
            event.eventId === firstEventId
          ) {
            await firstPublishStarted;

            publishedEventIds.push(
              event.eventId,
            );

            return;
          }

          publishedEventIds.push(
            event.eventId,
          );
        },
      };

      const workerA =
        new OutboxPublisher(
          prisma,
          publisher,
          {
            topic: "identity.events",
            workerId:
              "ordering-worker-a",
            batchSize: 1,
          },
        );

      const workerB =
        new OutboxPublisher(
          prisma,
          publisher,
          {
            topic: "identity.events",
            workerId:
              "ordering-worker-b",
            batchSize: 1,
          },
        );

      /*
      * Worker A claims the first event
      * and blocks while publishing it.
      */
      const workerAPromise =
        workerA.publishPending();

      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });

      /*
      * Worker B must NOT be allowed to
      * publish the second event while
      * the first event is still pending.
      */
      const secondWorkerCount =
        await workerB.publishPending();

      expect(
        secondWorkerCount,
      ).toBe(0);

      expect(
        publishedEventIds,
      ).toEqual([]);

      /*
      * Finish publishing the first event.
      */
      releaseFirstPublish?.();

      await workerAPromise;

      expect(
        publishedEventIds,
      ).toEqual([
        firstEventId,
      ]);

      /*
      * Now the second event becomes
      * eligible for publishing.
      */
      const thirdWorkerCount =
        await workerB.publishPending();

      expect(
        thirdWorkerCount,
      ).toBe(1);

      expect(
        publishedEventIds,
      ).toEqual([
        firstEventId,
        secondEventId,
      ]);
    },
  );
});