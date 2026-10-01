import { randomUUID } from "node:crypto";

import type { PrismaClient } from "../../generated/prisma/index.js";

import {
  AppErrors,
  ErrorCode,
} from "@talent/errors";
import type { AccountType } from "@talent/contracts";

import type { PasswordHasher } from "../ports/password-hasher.js";

import {
  isLoginIdentifierUniqueViolation,
  isUniqueConstraintError,
} from "../../infrastructure/database/prisma-error.js";

import type { OutboxFailureInjector } from "../ports/outbox-failure.js";

export interface RegisterUserInput {
  email: string;
  password: string;
  accountType: AccountType;
}

export interface RegisterUserOutput {
  userId: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly passwordHasher: PasswordHasher,
    private readonly outboxFailureInjector: OutboxFailureInjector,
  ) {}

  async execute(
    input: RegisterUserInput,
  ): Promise<RegisterUserOutput> {
    const email = input.email.trim().toLowerCase();

    const existingAccount =
      await this.prisma.account.findUnique({
        where: {
          loginIdentifier: email,
        },
      });

    if (existingAccount) {
      throw AppErrors.conflict(
        ErrorCode.EMAIL_ALREADY_EXISTS,
        "Email is already registered",
      );
    }

    const passwordHash =
      await this.passwordHasher.hash(input.password);

    try {
      const user = await this.prisma.$transaction(
        async (tx) => {
          const createdUser = await tx.user.create({
            data: {
              status: "ACTIVE",
              accountType: input.accountType,
            },
          });

          await tx.account.create({
            data: {
              userId: createdUser.id,
              provider: "LOCAL",
              loginIdentifier: email,
              passwordHash,
            },
          });

          if (this.outboxFailureInjector.shouldFail()) {
            throw new Error("OUTBOX_WRITE_FAILED");
          }

          await tx.outboxEvent.create({
            data: {
              eventId: randomUUID(),
              eventType: "identity.user.created",
              aggregateType: "User",
              aggregateId: createdUser.id,
              payload: {
                version: 1,
                producer: "identity-service",
                occurredAt: new Date().toISOString(),
                userId: createdUser.id,
                accountType: input.accountType,
                email,
              },
            },
          });

          return createdUser;
        },
      );

      return {
        userId: user.id,
      };
    } catch (error) {
      if (
        isUniqueConstraintError(error) &&
        isLoginIdentifierUniqueViolation(error)
      ) {
        throw AppErrors.conflict(
          ErrorCode.EMAIL_ALREADY_EXISTS,
          "Email is already registered",
        );
      }

      throw error;
    }
  }
}