import "dotenv/config";

import { buildApp } from "./app.js";
import { prisma } from "./infrastructure/database/prisma.js";

const port = Number(
  process.env.PORT ?? "4002",
);

const host =
  process.env.HOST ?? "127.0.0.1";

let app: Awaited<
  ReturnType<typeof buildApp>
> | undefined;

let shuttingDown = false;

async function shutdown(
  signal: string,
): Promise<void> {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  if (app) {
    app.log.info(
      { signal },
      "Shutting down",
    );

    await app.close();
  }

  await prisma.$disconnect();
}

async function start(): Promise<void> {
  try {
    app = await buildApp();

    await app.listen({
      port,
      host,
    });

    app.log.info(
      {
        host,
        port,
      },
      "Profile service started",
    );
  } catch (error) {
    if (app) {
      app.log.error(
        error,
        "Failed to start profile service",
      );
    } else {
      console.error(
        "Failed to start profile service",
        error,
      );
    }

    await prisma.$disconnect();

    process.exit(1);
  }
}

process.once(
  "SIGINT",
  () => {
    void shutdown("SIGINT");
  },
);

process.once(
  "SIGTERM",
  () => {
    void shutdown("SIGTERM");
  },
);

void start();