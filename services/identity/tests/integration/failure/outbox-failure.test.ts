import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { randomUUID } from "node:crypto";

import { buildApp } from "../../../src/app.js";
import { prisma } from "../../../src/infrastructure/database/prisma.js";

import type {
  OutboxFailureInjector,
} from "../../../src/application/ports/outbox-failure.js";

class FailOnceOutbox
  implements OutboxFailureInjector
{
  private failed = false;

  shouldFail(): boolean {
    if (!this.failed) {
      this.failed = true;
      return true;
    }

    return false;
  }
}

describe(
  "Outbox failure recovery",
  () => {
    beforeEach(async () => {
      await prisma.outboxEvent.deleteMany();
      await prisma.securityEvent.deleteMany();
      await prisma.session.deleteMany();
      await prisma.account.deleteMany();
      await prisma.user.deleteMany();
    });

    afterAll(async () => {
      await prisma.$disconnect();
    });

    it(
      "rolls back failed registration and succeeds after the outbox recovers",
      async () => {
        const failingInjector =
          new FailOnceOutbox();

        const app = buildApp({
          dependencies: {
            outboxFailureInjector:
              failingInjector,
          },
        });

        await app.ready();

        try {
          const failedEmail =
            `outbox-failure-${randomUUID()}@example.com`;

          const failedResponse =
            await app.inject({
              method: "POST",
              url: "/v1/auth/register",
              payload: {
                email: failedEmail,
                password:
                  "StrongPassword123!",
                accountType: "USER",
              },
            });

          expect(
            failedResponse.statusCode,
          ).toBe(500);

          const failedAccount =
            await prisma.account.findUnique({
              where: {
                loginIdentifier:
                  failedEmail,
              },
            });

          expect(
            failedAccount,
          ).toBeNull();

          const failedUser =
            await prisma.user.findFirst({
              where: {
                accounts: {
                  some: {
                    loginIdentifier:
                      failedEmail,
                  },
                },
              },
            });

          expect(
            failedUser,
          ).toBeNull();

          const events =
            await prisma.outboxEvent.findMany({
              select: {
                payload: true,
              },
            });

          const failedEventExists =
            events.some((event) => {
              const payload =
                event.payload as {
                  email?: string;
                };

              return (
                payload.email ===
                failedEmail
              );
            });

          expect(
            failedEventExists,
          ).toBe(false);

          /**
           * The injector now allows the next
           * transaction to succeed.
           */
          const successEmail =
            `outbox-recovery-${randomUUID()}@example.com`;

          const successResponse =
            await app.inject({
              method: "POST",
              url: "/v1/auth/register",
              payload: {
                email: successEmail,
                password:
                  "StrongPassword123!",
                accountType: "USER",
              },
            });

          expect(
            successResponse.statusCode,
          ).toBe(201);

          const successBody =
            successResponse.json<{
              success: boolean;
              data: {
                userId: string;
              };
            }>();

          expect(
            successBody.success,
          ).toBe(true);

          const successAccount =
            await prisma.account.findUnique({
              where: {
                loginIdentifier:
                  successEmail,
              },
            });

          expect(
            successAccount,
          ).not.toBeNull();

          const successEvent =
            await prisma.outboxEvent.findFirst({
              where: {
                aggregateId:
                  successBody.data.userId,
              },
            });

          expect(
            successEvent,
          ).not.toBeNull();

          expect(
            successEvent?.eventType,
          ).toBe(
            "identity.user.created",
          );
        } finally {
          await app.close();
        }
      },
    );
  },
);