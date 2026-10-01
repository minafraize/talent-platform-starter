import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { buildApp } from "../../../src/app.js";
import { prisma } from "../../../src/infrastructure/database/prisma.js";
import type { OutboxFailureInjector } from "../../../src/application/ports/outbox-failure.js";

describe("POST /v1/auth/register", () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    await prisma.outboxEvent.deleteMany();
    await prisma.securityEvent.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it("registers a new user account", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        email: "mina@example.com",
        password: "StrongPassword123!",
        accountType: "USER",
      },
    });

    expect(response.statusCode).toBe(201);

    const body = response.json<{
      success: boolean;
      data: {
        userId: string;
      };
      meta: {
        requestId: string;
      };
    }>();

    expect(body.success).toBe(true);
    expect(body.data.userId).toEqual(expect.any(String));
    expect(body.meta.requestId).toEqual(expect.any(String));

    const user = await prisma.user.findUnique({
      where: {
        id: body.data.userId,
      },
      include: {
        accounts: true,
      },
    });

    expect(user).not.toBeNull();
    expect(user?.accounts).toHaveLength(1);

    const account = user!.accounts[0];

    expect(account?.provider).toBe("LOCAL");
    expect(account?.loginIdentifier).toBe("mina@example.com");
    expect(account?.passwordHash).toBeTruthy();
    expect(account?.passwordHash).not.toBe(
      "StrongPassword123!",
    );

    const outboxEvent =
      await prisma.outboxEvent.findFirst({
        where: {
          aggregateId: body.data.userId,
        },
      });

    expect(outboxEvent).not.toBeNull();

    expect(outboxEvent?.eventType).toBe(
      "identity.user.created",
    );

    expect(outboxEvent?.aggregateType).toBe("User");
    expect(outboxEvent?.publishedAt).toBeNull();

    const payload = outboxEvent?.payload as {
      version: number;
      producer: string;
      occurredAt: string;
      userId: string;
      accountType: string;
      email: string;
    };

    expect(payload.version).toBe(1);
    expect(payload.producer).toBe(
      "identity-service",
    );
    expect(payload.occurredAt).toEqual(
      expect.any(String),
    );
    expect(payload.userId).toBe(body.data.userId);
    expect(payload.accountType).toBe("USER");
    expect(payload.email).toBe("mina@example.com");
  });

  it.each([
    "USER",
    "TALENT",
    "PROFESSIONAL",
  ] as const)(
    "accepts %s account type",
    async (accountType) => {
      const email =
        `${accountType.toLowerCase()}@example.com`;

      const response = await app.inject({
        method: "POST",
        url: "/v1/auth/register",
        payload: {
          email,
          password: "StrongPassword123!",
          accountType,
        },
      });

      expect(response.statusCode).toBe(201);

      const body = response.json<{
        success: boolean;
        data: {
          userId: string;
        };
      }>();

      expect(body.success).toBe(true);
      expect(body.data.userId).toEqual(
        expect.any(String),
      );

      const outboxEvent =
        await prisma.outboxEvent.findFirst({
          where: {
            aggregateId: body.data.userId,
          },
        });

      expect(outboxEvent).not.toBeNull();

      const payload = outboxEvent?.payload as {
        userId: string;
        accountType: string;
      };

      expect(payload.userId).toBe(body.data.userId);
      expect(payload.accountType).toBe(accountType);
    },
  );

  it("returns EMAIL_ALREADY_EXISTS for duplicate email", async () => {
    const firstResponse = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        email: "mina@example.com",
        password: "StrongPassword123!",
        accountType: "TALENT",
      },
    });

    expect(firstResponse.statusCode).toBe(201);

    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        email: "MINA@example.com",
        password: "AnotherStrongPassword123!",
        accountType: "PROFESSIONAL",
      },
    });

    expect(response.statusCode).toBe(409);

    const body = response.json<{
      success: boolean;
      error: {
        code: string;
        message: string;
        details: unknown;
        requestId: string;
      };
    }>();

    expect(body.success).toBe(false);
    expect(body.error.code).toBe(
      "EMAIL_ALREADY_EXISTS",
    );
    expect(body.error.message).toBe(
      "Email is already registered",
    );
    expect(body.error.details).toBeNull();
    expect(body.error.requestId).toEqual(
      expect.any(String),
    );
  });

  it("returns VALIDATION_ERROR for invalid email", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        email: "not-an-email",
        password: "StrongPassword123!",
        accountType: "USER",
      },
    });

    expect(response.statusCode).toBe(400);

    const body = response.json<{
      success: boolean;
      error: {
        code: string;
        message: string;
        details: unknown;
        requestId: string;
      };
    }>();

    expect(body.success).toBe(false);
    expect(body.error.code).toBe(
      "VALIDATION_ERROR",
    );
    expect(body.error.requestId).toEqual(
      expect.any(String),
    );
    expect(body.error.details).toBeTruthy();
  });

  it("returns VALIDATION_ERROR for invalid account type", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        email: "invalid-type@example.com",
        password: "StrongPassword123!",
        accountType: "INVALID",
      },
    });

    expect(response.statusCode).toBe(400);

    const body = response.json<{
      success: boolean;
      error: {
        code: string;
      };
    }>();

    expect(body.success).toBe(false);
    expect(body.error.code).toBe(
      "VALIDATION_ERROR",
    );
  });

  it("returns VALIDATION_ERROR for missing account type", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        email: "missing-type@example.com",
        password: "StrongPassword123!",
      },
    });

    expect(response.statusCode).toBe(400);

    const body = response.json<{
      success: boolean;
      error: {
        code: string;
      };
    }>();

    expect(body.success).toBe(false);
    expect(body.error.code).toBe(
      "VALIDATION_ERROR",
    );
  });

  it("returns VALIDATION_ERROR for weak password", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        email: "mina@example.com",
        password: "123",
        accountType: "USER",
      },
    });

    expect(response.statusCode).toBe(400);

    const body = response.json<{
      success: boolean;
      error: {
        code: string;
      };
    }>();

    expect(body.success).toBe(false);
    expect(body.error.code).toBe(
      "VALIDATION_ERROR",
    );
  });

  it("returns EMAIL_ALREADY_EXISTS when concurrent registrations race", async () => {
    const requests = Array.from(
      { length: 2 },
      () =>
        app.inject({
          method: "POST",
          url: "/v1/auth/register",
          payload: {
            email: "race@example.com",
            password: "StrongPassword123!",
            accountType: "TALENT",
          },
        }),
    );

    const [first, second] =
      await Promise.all(requests);

    const statuses = [
      first.statusCode,
      second.statusCode,
    ].sort();

    expect(statuses).toEqual([201, 409]);

    const users =
      await prisma.user.findMany({
        where: {
          accounts: {
            some: {
              loginIdentifier:
                "race@example.com",
            },
          },
        },
      });

    expect(users).toHaveLength(1);

    const account =
      await prisma.account.findFirst({
        where: {
          loginIdentifier:
            "race@example.com",
        },
      });

    expect(account).not.toBeNull();
  });

  it("rolls back user, account, and outbox event when outbox creation fails", async () => {
    class AlwaysFailOutbox
      implements OutboxFailureInjector
    {
      shouldFail(): boolean {
        return true;
      }
    }

    const failingApp = buildApp({
      dependencies: {
        outboxFailureInjector:
          new AlwaysFailOutbox(),
      },
    });

    await failingApp.ready();

    try {
      const usersBefore =
        await prisma.user.count();

      const accountsBefore =
        await prisma.account.count();

      const outboxBefore =
        await prisma.outboxEvent.count();

      const response =
        await failingApp.inject({
          method: "POST",
          url: "/v1/auth/register",
          payload: {
            email: "rollback@example.com",
            password:
              "StrongPassword123!",
            accountType: "PROFESSIONAL",
          },
        });

      expect(response.statusCode).toBe(500);

      const body = response.json<{
        success: boolean;
        error: {
          code: string;
          message: string;
          details: unknown;
          requestId: string;
        };
      }>();

      expect(body.success).toBe(false);

      expect(body.error.code).toBe(
        "INTERNAL_SERVER_ERROR",
      );

      expect(body.error.message).toBe(
        "An unexpected error occurred",
      );

      expect(body.error.details).toBeNull();

      expect(body.error.requestId).toEqual(
        expect.any(String),
      );

      const usersAfter =
        await prisma.user.count();

      const accountsAfter =
        await prisma.account.count();

      const outboxAfter =
        await prisma.outboxEvent.count();

      expect(usersAfter).toBe(usersBefore);
      expect(accountsAfter).toBe(accountsBefore);
      expect(outboxAfter).toBe(outboxBefore);

      const account =
        await prisma.account.findUnique({
          where: {
            loginIdentifier:
              "rollback@example.com",
          },
        });

      expect(account).toBeNull();

      const rollbackUsers =
        await prisma.user.findMany({
          where: {
            accounts: {
              some: {
                loginIdentifier:
                  "rollback@example.com",
              },
            },
          },
        });

      expect(rollbackUsers).toHaveLength(0);

      const rollbackEvents =
        await prisma.outboxEvent.findMany();

      const rollbackEventExists =
        rollbackEvents.some((event) => {
          const payload = event.payload as {
            email?: string;
          };

          return (
            payload.email ===
            "rollback@example.com"
          );
        });

      expect(rollbackEventExists).toBe(false);
    } finally {
      await failingApp.close();
    }
  });
});