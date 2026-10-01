import "dotenv/config";

import { prisma } from "../infrastructure/database/prisma.js";
import { KafkaEventPublisher } from "../infrastructure/kafka/kafka-event-publisher.js";
import { OutboxPublisher } from "../application/outbox/outbox-publisher.js";
import { OutboxWorker } from "./outbox.worker.js";

const topic =
  process.env.KAFKA_IDENTITY_TOPIC ??
  "identity.events";

const batchSize = Number(
  process.env.OUTBOX_BATCH_SIZE ?? "100",
);

const pollIntervalMs = Number(
  process.env.OUTBOX_POLL_INTERVAL_MS ?? "1000",
);

const eventPublisher =
  new KafkaEventPublisher();

const outboxPublisher =
  new OutboxPublisher(
    prisma,
    eventPublisher,
    {
      topic,
      batchSize,
    },
  );

const worker = new OutboxWorker(
  outboxPublisher,
  {
    pollIntervalMs,
  },
);

let shutdownPromise: Promise<void> | null = null;

async function shutdown(
  signal: string,
): Promise<void> {
  if (shutdownPromise) {
    return shutdownPromise;
  }

  shutdownPromise = (async () => {
    console.log(
      JSON.stringify({
        message: "Shutdown requested",
        signal,
      }),
    );

    await worker.stop();
    await eventPublisher.disconnect();
    await prisma.$disconnect();

    console.log(
      JSON.stringify({
        message:
          "Identity outbox worker stopped",
      }),
    );
  })();

  return shutdownPromise;
}

async function main(): Promise<void> {
  console.log(
    JSON.stringify({
      message: "Identity outbox worker started",
      topic,
      batchSize,
      pollIntervalMs,
    }),
  );

  worker.start();

  await new Promise<void>((resolve) => {
    process.once("SIGINT", () => {
      void shutdown("SIGINT").finally(resolve);
    });

    process.once("SIGTERM", () => {
      void shutdown("SIGTERM").finally(resolve);
    });
  });
}

void main().catch(async (error) => {
  console.error(
    JSON.stringify({
      message: "Identity outbox worker crashed",
      error:
        error instanceof Error
          ? error.stack ?? error.message
          : String(error),
    }),
  );

  await eventPublisher.disconnect();
  await prisma.$disconnect();
  process.exit(1);
});
