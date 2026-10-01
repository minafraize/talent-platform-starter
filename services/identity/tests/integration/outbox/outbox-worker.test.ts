import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { prisma } from "../../../src/infrastructure/database/prisma";

import {
  OutboxPublisher,
} from "../../../src/application/outbox/outbox-publisher";

import type {
  EventPublisher,
} from "../../../src/application/ports/event-publisher";

import {
  OutboxWorker,
} from "../../../src/workers/outbox.worker";

describe("OutboxWorker", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.outboxEvent.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("publishes pending events while running", async () => {
    const publishedEvents: unknown[] = [];

    const publisher: EventPublisher = {
      async publish(input) {
        publishedEvents.push(input);
      },
    };

    await prisma.outboxEvent.create({
      data: {
        eventId: crypto.randomUUID(),
        eventType: "identity.user.created",
        aggregateType: "User",
        aggregateId: crypto.randomUUID(),
        payload: {
          userId: crypto.randomUUID(),
          email: "worker@example.com",
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

    const worker = new OutboxWorker(
      outboxPublisher,
      {
        pollIntervalMs: 50,
      },
    );

    worker.start();

    await waitUntil(() =>
      publishedEvents.length === 1,
    );

    await worker.stop();

    expect(publishedEvents).toHaveLength(1);
  });

  it("stops polling when stop is called", async () => {
    let publishCount = 0;

    const publisher: EventPublisher = {
      async publish() {
        publishCount++;
      },
    };

    await prisma.outboxEvent.create({
      data: {
        eventId: crypto.randomUUID(),
        eventType: "identity.user.created",
        aggregateType: "User",
        aggregateId: crypto.randomUUID(),
        payload: {
          userId: crypto.randomUUID(),
          email: "stop@example.com",
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

    const worker = new OutboxWorker(
      outboxPublisher,
      {
        pollIntervalMs: 50,
      },
    );

    worker.start();

    await waitUntil(() =>
      publishCount === 1,
    );

    await worker.stop();

    const countAfterStop =
      publishCount;

    await new Promise((resolve) =>
      setTimeout(resolve, 150),
    );

    expect(publishCount).toBe(
      countAfterStop,
    );
  });

  it("continues polling after a publishing failure", async () => {
    let attempts = 0;

    const publisher: EventPublisher = {
      async publish() {
        attempts++;

        if (attempts === 1) {
          throw new Error(
            "TEMPORARY_KAFKA_FAILURE",
          );
        }
      },
    };

    await prisma.outboxEvent.create({
      data: {
        eventId: crypto.randomUUID(),
        eventType: "identity.user.created",
        aggregateType: "User",
        aggregateId: crypto.randomUUID(),
        payload: {
          userId: crypto.randomUUID(),
          email: "retry@example.com",
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

    const worker = new OutboxWorker(
      outboxPublisher,
      {
        pollIntervalMs: 50,
      },
    );

    worker.start();

    await waitUntil(() =>
      attempts >= 2,
    );

    await worker.stop();

    expect(attempts).toBeGreaterThanOrEqual(2);
  });
});

async function waitUntil(
  condition: () => boolean,
  timeoutMs = 5_000,
): Promise<void> {
  const startedAt = Date.now();

  while (!condition()) {
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error(
        "Timed out waiting for condition",
      );
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 25),
    );
  }
}