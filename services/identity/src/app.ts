import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

import type { PrismaClient } from "./generated/prisma/index.js";

import type {
  PasswordHasher,
} from "./application/ports/password-hasher.js";

import type {
  OutboxFailureInjector,
} from "./application/ports/outbox-failure.js";

import {
  createApplicationDependencies,
} from "./application/container.js";

import {
  prisma as defaultPrisma,
} from "./infrastructure/database/prisma.js";

import {
  Argon2PasswordHasher,
} from "./infrastructure/security/argon2-password-hasher.js";

import {
  NoopOutboxFailureInjector,
} from "./infrastructure/outbox/noop-outbox-failure-injector.js";

import {
  authRoutes,
} from "./presentation/http/auth.routes.js";

import {
  accountRoutes,
} from "./presentation/http/account.routes.js";

import {
  registerErrorHandler,
} from "./presentation/http/error-handler.js";

import {
  JoseTokenService,
} from "./infrastructure/security/jose-token-service.js";

import {
  redis,
} from "./infrastructure/redis/redis.js";

import {
  RedisRateLimiter,
} from "./infrastructure/redis/redis-rate-limiter.js";

export interface AppDependencies {
  prisma: PrismaClient;
  passwordHasher: PasswordHasher;
  outboxFailureInjector: OutboxFailureInjector;
}

export interface BuildAppOptions {
  dependencies?: Partial<AppDependencies>;
}

export function buildApp(
  options: BuildAppOptions = {},
) {
  const app = Fastify({
    logger: true,
  });

  app.register(helmet);

  app.register(cors, {
    origin: true,
  });

  const dependencies =
    createApplicationDependencies({
      prisma:
        options.dependencies?.prisma ??
        defaultPrisma,

      passwordHasher:
        options.dependencies?.passwordHasher ??
        new Argon2PasswordHasher(),

      outboxFailureInjector:
        options.dependencies
          ?.outboxFailureInjector ??
        new NoopOutboxFailureInjector(),

      tokenService:
        new JoseTokenService(),

      rateLimiter:
        new RedisRateLimiter(redis),
    });

  app.get(
    "/health",
    async () => {
      return {
        success: true,
        data: {
          status: "ok",
          service: "identity-service",
        },
        meta: {},
      };
    },
  );

  app.register(
    authRoutes,
    {
      prefix: "/v1/auth",

      registerUser:
        dependencies.registerUser,

      loginUser:
        dependencies.loginUser,

      refreshSession:
        dependencies.refreshSession,

      logoutUser:
        dependencies.logoutUser,

      getCurrentUser:
        dependencies.getCurrentUser,

      tokenService:
        dependencies.tokenService,
    },
  );

  app.register(
    accountRoutes,
    {
      prefix: "/v1/account",

      upgradeAccount:
        dependencies.upgradeAccount,
    },
  );

  registerErrorHandler(app);

  return app;
}