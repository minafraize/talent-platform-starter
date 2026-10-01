import "dotenv/config";

import { buildApp } from "./app.js";
import { prisma } from "./infrastructure/database/prisma.js";

const app = buildApp();

const port = Number(process.env.PORT ?? 4001);
const host = "0.0.0.0";

async function start() {
  try {
    await app.listen({
      port,
      host,
    });

    console.log(
      `Identity service listening on ${host}:${port}`,
    );
  } catch (error) {
    app.log.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function shutdown(signal: string) {
  app.log.info(`Received ${signal}`);

  await app.close();
  await prisma.$disconnect();

  process.exit(0);
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

void start();