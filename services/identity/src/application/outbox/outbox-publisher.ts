import {
  randomUUID,
} from "node:crypto";

import type {
  PrismaClient,
} from "../../generated/prisma/index.js";

import type {
  EventPublisher,
} from "../ports/event-publisher.js";

import {
  OutboxRetryPolicy,
} from "./retry-policy.js";

export interface OutboxPublisherOptions {
  topic: string;
  batchSize?: number;
  workerId?: string;
  claimLeaseMs?: number;
  retryPolicy?: OutboxRetryPolicy;
}

export class OutboxPublisher {
  private readonly batchSize: number;
  private readonly workerId: string;
  private readonly claimLeaseMs: number;
  private readonly retryPolicy: OutboxRetryPolicy;

  constructor(
    private readonly prisma: PrismaClient,
    private readonly eventPublisher: EventPublisher,
    private readonly options: OutboxPublisherOptions,
  ) {
    this.batchSize =
      options.batchSize ?? 100;

    this.workerId =
      options.workerId ??
      `identity-outbox-${randomUUID()}`;

    this.claimLeaseMs =
      options.claimLeaseMs ??
      5 * 60 * 1_000;

    this.retryPolicy =
      options.retryPolicy ??
      new OutboxRetryPolicy();
  }

  async publishPending(): Promise<number> {
    const events =
      await this.claimPendingEvents();

    let publishedCount = 0;

    for (const event of events) {
      try {
        const envelope = {
          eventId: event.eventId,
          eventType: event.eventType,
          version: 1,
          producer: "identity-service",
          occurredAt:
            event.createdAt.toISOString(),
          aggregateId: event.aggregateId,
          payload: event.payload,
        };

        await this.eventPublisher.publish({
          topic: this.options.topic,
          key: event.aggregateId,
          event: envelope,
        });

        await this.markPublished(event.id);

        publishedCount++;
      } catch (error) {
        await this.markFailed(
          event.id,
          event.attempts,
          error,
        );
      }
    }

    return publishedCount;
  }

  private async claimPendingEvents() {
    const now = new Date();

    const staleBefore = new Date(
      now.getTime() -
        this.claimLeaseMs,
    );

    return this.prisma.$transaction(
      async (tx) => {
        const events =
          await tx.$queryRaw<
            Array<{
              id: string;
              eventId: string;
              eventType: string;
              aggregateType: string;
              aggregateId: string;
              payload: unknown;
              createdAt: Date;
              attempts: number;
            }>
          >`
            SELECT
              "id",
              "eventId",
              "eventType",
              "aggregateType",
              "aggregateId",
              "payload",
              "createdAt",
              "attempts"
            FROM "outbox_events"
            WHERE "publishedAt" IS NULL
              AND "failedAt" IS NULL
              AND "attempts" < ${this.retryPolicy.maxAttempts}
              AND (
                "nextAttemptAt" IS NULL
                OR "nextAttemptAt" <= ${now}
              )
              AND (
                "claimedAt" IS NULL
                OR "claimedAt" < ${staleBefore}
              )
            ORDER BY "createdAt" ASC
            LIMIT ${this.batchSize}
            FOR UPDATE SKIP LOCKED
          `;

        if (events.length === 0) {
          return [];
        }

        const ids = events.map(
          (event) => event.id,
        );

        await tx.outboxEvent.updateMany({
          where: {
            id: {
              in: ids,
            },
          },
          data: {
            claimedAt: now,
            claimedBy: this.workerId,
          },
        });

        return events;
      },
    );
  }

  private async markPublished(
    id: string,
  ): Promise<void> {
    await this.prisma.outboxEvent.updateMany({
      where: {
        id,
        claimedBy: this.workerId,
      },
      data: {
        publishedAt: new Date(),
        attempts: {
          increment: 1,
        },
        claimedAt: null,
        claimedBy: null,
        nextAttemptAt: null,
        lastError: null,
      },
    });
  }

  private async markFailed(
    id: string,
    currentAttempts: number,
    error: unknown,
  ): Promise<void> {
    const nextAttemptNumber = currentAttempts + 1;

    if (
      nextAttemptNumber >=
      this.retryPolicy.maxAttempts
    ) {
      await this.prisma.outboxEvent.updateMany({
        where: {
          id,
          claimedBy: this.workerId,
        },
        data: {
          attempts: nextAttemptNumber,
          failedAt: new Date(),
          lastError:
            error instanceof Error
              ? error.message
              : String(error),
          claimedAt: null,
          claimedBy: null,
          nextAttemptAt: null,
        },
      });

      return;
    }

    const nextAttemptAt =
      this.retryPolicy.getNextAttemptAt(
        nextAttemptNumber,
      );

    await this.prisma.outboxEvent.updateMany({
      where: {
        id,
        claimedBy: this.workerId,
      },
      data: {
        attempts: nextAttemptNumber,
        nextAttemptAt,
        lastError:
          error instanceof Error
            ? error.message
            : String(error),
        claimedAt: null,
        claimedBy: null,
      },
    });
  }
}