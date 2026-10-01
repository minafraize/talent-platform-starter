import "dotenv/config";

import { prisma } from "../infrastructure/database/prisma.js";
import {
  startProfileEventsConsumer,
} from "../infrastructure/kafka/profile-events.consumer.js";

async function main(): Promise<void> {
  const runtime =
    await startProfileEventsConsumer(
      prisma,
    );

  console.log(
    "Profile events worker started",
  );

  const shutdown = async (
    signal: string,
  ): Promise<void> => {
    console.log(
      `${signal} received, shutting down...`,
    );

    await runtime.stop();
    await prisma.$disconnect();

    process.exit(0);
  };

  process.once("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.once("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

void main().catch(async (error) => {
  console.error(
    "Profile events worker failed",
    error,
  );

  await prisma.$disconnect();

  process.exit(1);
});