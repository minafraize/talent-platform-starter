import { randomUUID } from "node:crypto";

import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";

import { prisma } from "../../src/infrastructure/database/prisma.js";
import {
  startProfileEventsConsumer,
  type ProfileEventsConsumerRuntime,
} from "../../src/infrastructure/kafka/profile-events.consumer.js";

const baseUrl =
  process.env.E2E_IDENTITY_BASE_URL ??
  "http://127.0.0.1:4001";

const registerPath =
  process.env.E2E_REGISTER_PATH ??
  "/v1/auth/register";

const createdUserIds = new Set<string>();

interface RegisterSuccessResponse {
  success: true;
  data: {
    userId: string;
  };
  meta: {
    requestId: string;
  };
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details: unknown;
    requestId: string;
  };
}

async function register(
  payload: Record<string, unknown>,
): Promise<Response> {
  return fetch(
    `${baseUrl}${registerPath}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
}

async function waitFor(
  condition: () => Promise<boolean>,
  timeoutMs = 15_000,
  intervalMs = 250,
): Promise<void> {
  const startedAt = Date.now();

  while (
    Date.now() - startedAt <
    timeoutMs
  ) {
    if (await condition()) {
      return;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, intervalMs);
    });
  }

  throw new Error(
    `Condition was not satisfied within ${timeoutMs}ms`,
  );
}

async function waitForProfile(
  userId: string,
): Promise<void> {
  await waitFor(
    async () => {
      const account =
        await prisma.account.findUnique({
          where: {
            userId,
          },
        });

      return account !== null;
    },
  );
}

describe(
  "Registration → Kafka → Profile E2E",
  () => {
    let consumerRuntime:
      | ProfileEventsConsumerRuntime
      | undefined;

    beforeAll(async () => {
      const groupId =
        `profile-e2e-${randomUUID()}`;

      consumerRuntime =
        await startProfileEventsConsumer(
          prisma,
          {
            groupId,
            topic:
              process.env.KAFKA_IDENTITY_TOPIC ??
              "identity.events",
            fromBeginning: false,
            waitForReady: true,
            readyTimeoutMs: 10_000,
          },
        );
    });

    afterAll(async () => {
      await consumerRuntime?.stop();

      for (const userId of createdUserIds) {
        await prisma.profile.deleteMany({
          where: {
            account: {
              userId,
            },
          },
        });

        await prisma.talentProfile.deleteMany({
          where: {
            account: {
              userId,
            },
          },
        });

        await prisma.professionalProfile.deleteMany({
          where: {
            account: {
              userId,
            },
          },
        });

        await prisma.account.deleteMany({
          where: {
            userId,
          },
        });
      }

      await prisma.$disconnect();
    });

    describe("successful registration", () => {
      it.each([
        "USER",
        "TALENT",
        "PROFESSIONAL",
      ] as const)(
        "creates a %s profile through the full event flow",
        async (accountType) => {
          const email =
            `e2e-${accountType.toLowerCase()}-${randomUUID()}@example.com`;

          const response =
            await register({
              email,
              password:
                "StrongPassword123!",
              accountType,
            });

          const responseText =
            await response.text();

          expect(
            response.status,
            `Unexpected registration response: ${responseText}`,
          ).toBe(201);

          const body =
            JSON.parse(
              responseText,
            ) as RegisterSuccessResponse;

          expect(body.success).toBe(true);

          expect(
            body.data.userId,
          ).toEqual(expect.any(String));

          const userId =
            body.data.userId;

          createdUserIds.add(userId);

          await waitForProfile(userId);

          const account =
            await prisma.account.findUnique({
              where: {
                userId,
              },
              include: {
                profile: true,
                talentProfile: true,
                professionalProfile: true,
              },
            });

          expect(account).not.toBeNull();

          expect(
            account?.userId,
          ).toBe(userId);

          expect(
            account?.type,
          ).toBe(accountType);

          expect(
            account?.status,
          ).toBe("ACTIVE");

          expect(
            account?.profile,
          ).not.toBeNull();

          expect(
            account?.talentProfile !== null,
          ).toBe(
            accountType === "TALENT",
          );

          expect(
            account?.professionalProfile !== null,
          ).toBe(
            accountType === "PROFESSIONAL",
          );
        },
        15_000,
      );
    });

    describe("registration validation", () => {
      it("rejects duplicate email", async () => {
        const email =
          `e2e-duplicate-${randomUUID()}@example.com`;

        const firstResponse =
          await register({
            email,
            password:
              "StrongPassword123!",
            accountType: "USER",
          });

        const firstResponseText =
          await firstResponse.text();

        expect(
          firstResponse.status,
          `First registration failed: ${firstResponseText}`,
        ).toBe(201);

        const firstBody =
          JSON.parse(
            firstResponseText,
          ) as RegisterSuccessResponse;

        const firstUserId =
          firstBody.data.userId;

        createdUserIds.add(firstUserId);

        await waitForProfile(
          firstUserId,
        );

        const duplicateResponse =
          await register({
            email: email.toUpperCase(),
            password:
              "AnotherStrongPassword123!",
            accountType: "TALENT",
          });

        const duplicateBody =
          (await duplicateResponse.json()) as ErrorResponse;

        expect(
          duplicateResponse.status,
        ).toBe(409);

        expect(
          duplicateBody.success,
        ).toBe(false);

        expect(
          duplicateBody.error.code,
        ).toBe(
          "EMAIL_ALREADY_EXISTS",
        );

        expect(
          duplicateBody.error.message,
        ).toBe(
          "Email is already registered",
        );

        expect(
          duplicateBody.error.requestId,
        ).toEqual(expect.any(String));

        const firstAccount =
          await prisma.account.findUnique({
            where: {
              userId: firstUserId,
            },
          });

        expect(
          firstAccount,
        ).not.toBeNull();

        expect(
          firstAccount?.type,
        ).toBe("USER");
      });

      it("rejects invalid email", async () => {
        const response =
          await register({
            email: "not-an-email",
            password:
              "StrongPassword123!",
            accountType: "USER",
          });

        const body =
          (await response.json()) as ErrorResponse;

        expect(
          response.status,
        ).toBe(400);

        expect(
          body.success,
        ).toBe(false);

        expect(
          body.error.code,
        ).toBe("VALIDATION_ERROR");

        expect(
          body.error.requestId,
        ).toEqual(expect.any(String));

        expect(
          body.error.details,
        ).toBeTruthy();
      });

      it("rejects weak password", async () => {
        const response =
          await register({
            email:
              `e2e-weak-${randomUUID()}@example.com`,
            password: "123",
            accountType: "USER",
          });

        const body =
          (await response.json()) as ErrorResponse;

        expect(
          response.status,
        ).toBe(400);

        expect(
          body.success,
        ).toBe(false);

        expect(
          body.error.code,
        ).toBe("VALIDATION_ERROR");
      });

      it("rejects invalid account type", async () => {
        const response =
          await register({
            email:
              `e2e-invalid-type-${randomUUID()}@example.com`,
            password:
              "StrongPassword123!",
            accountType:
              "ADMIN",
          });

        const body =
          (await response.json()) as ErrorResponse;

        expect(
          response.status,
        ).toBe(400);

        expect(
          body.success,
        ).toBe(false);

        expect(
          body.error.code,
        ).toBe("VALIDATION_ERROR");

        expect(
          body.error.requestId,
        ).toEqual(expect.any(String));

        expect(
          body.error.details,
        ).toBeTruthy();
      });

      it("rejects missing account type", async () => {
        const response =
          await register({
            email:
              `e2e-missing-type-${randomUUID()}@example.com`,
            password:
              "StrongPassword123!",
          });

        const body =
          (await response.json()) as ErrorResponse;

        expect(
          response.status,
        ).toBe(400);

        expect(
          body.success,
        ).toBe(false);

        expect(
          body.error.code,
        ).toBe("VALIDATION_ERROR");

        expect(
          body.error.requestId,
        ).toEqual(expect.any(String));

        expect(
          body.error.details,
        ).toBeTruthy();
      });
    });
  },
);
