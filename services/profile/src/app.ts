import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

import { registerHealthRoutes } from "./presentation/http/health.routes.js";
import { profileRoutes } from "./presentation/http/profile.routes.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(helmet);
  app.register(cors);

  app.register(registerHealthRoutes);
  await app.register(profileRoutes);

  return app;
}