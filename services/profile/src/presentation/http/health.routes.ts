import type { FastifyInstance } from "fastify";

import { prisma } from "../../infrastructure/database/prisma.js";

export async function registerHealthRoutes(
  app: FastifyInstance,
): Promise<void> {
  app.get("/health", async () => {
    return {
      status: "ok",
      service: "profile",
    };
  });

  app.get("/ready", async () => {
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: "ready",
      service: "profile",
    };
  });
}