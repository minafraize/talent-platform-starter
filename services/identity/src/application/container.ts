import type { PrismaClient } from "../generated/prisma/index.js";

import {
  RegisterUserUseCase,
} from "./use-cases/register-user.js";

import {
  LoginUserUseCase,
} from "./use-cases/login-user.js";

import {
  RefreshSessionUseCase,
} from "./use-cases/refresh-session.js";

import {
  LogoutUserUseCase,
} from "./use-cases/logout-user.js";

import {
  GetCurrentUserUseCase,
} from "./use-cases/get-current-user.js";

import {
  UpgradeAccountUseCase,
} from "./use-cases/upgrade-account.js";

import type {
  PasswordHasher,
} from "./ports/password-hasher.js";

import type {
  OutboxFailureInjector,
} from "./ports/outbox-failure.js";

import type {
  TokenService,
} from "./ports/token-service.js";

import {
  LoginRateLimiter,
} from "./security/login-rate-limiter.js";

import type {
  RateLimiter,
} from "./ports/rate-limiter.js";

export interface ApplicationDependencies {
  prisma: PrismaClient;
  passwordHasher: PasswordHasher;
  outboxFailureInjector: OutboxFailureInjector;
  tokenService: TokenService;
  rateLimiter: RateLimiter;
}

export function createApplicationDependencies(
  dependencies: ApplicationDependencies,
) {
  const loginRateLimiter =
    new LoginRateLimiter(
      dependencies.rateLimiter,
    );

  return {
    registerUser:
      new RegisterUserUseCase(
        dependencies.prisma,
        dependencies.passwordHasher,
        dependencies.outboxFailureInjector,
      ),

    loginUser:
      new LoginUserUseCase(
        dependencies.prisma,
        dependencies.passwordHasher,
        dependencies.tokenService,
        loginRateLimiter,
      ),

    refreshSession:
      new RefreshSessionUseCase(
        dependencies.prisma,
        dependencies.tokenService,
      ),

    logoutUser:
      new LogoutUserUseCase(
        dependencies.prisma,
      ),

    getCurrentUser:
      new GetCurrentUserUseCase(
        dependencies.prisma,
      ),

    upgradeAccount:
      new UpgradeAccountUseCase(
        dependencies.prisma,
      ),

    tokenService:
      dependencies.tokenService,
  };
}