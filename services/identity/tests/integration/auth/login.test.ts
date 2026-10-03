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

describe("POST /v1/auth/login", () => {
  const app = buildApp();
  const TEST_REMOTE_ADDRESS = "127.0.0.4";

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

  it("logs in an existing user", async () => {
    const email = "login@example.com";
    const password = "StrongPassword123!";
    const accountType = "USER";

    const registerResponse = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        email,
        password,
        accountType,
      },
    });

    expect(registerResponse.statusCode).toBe(201);

    const registerBody = registerResponse.json<{
      success: boolean;
      data: {
        userId: string;
      };
      meta: {
        requestId: string;
      };
    }>();

    expect(registerBody.success).toBe(true);

    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      remoteAddress: TEST_REMOTE_ADDRESS,
      payload: {
        email,
        password,
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json<{
      success: boolean;
      data: {
        user: {
          userId: string;
        };
        accessToken: string;
        refreshToken: string;
        expiresAt: string;
      };
      meta: {
        requestId: string;
      };
    }>();

    expect(body.success).toBe(true);

    expect(body.data.user.userId).toBe(
      registerBody.data.userId,
    );

    expect(body.data.accessToken).toEqual(
      expect.any(String),
    );

    expect(body.data.refreshToken).toEqual(
      expect.any(String),
    );

    expect(body.data.expiresAt).toEqual(
      expect.any(String),
    );

    expect(body.meta.requestId).toEqual(
      expect.any(String),
    );

    const sessions = await prisma.session.findMany({
      where: {
        userId: registerBody.data.userId,
      },
    });

    expect(sessions).toHaveLength(1);

    const session = sessions[0];

    expect(session).toBeDefined();
    expect(session?.status).toBe("ACTIVE");
    expect(session?.tokenHash).toBeTruthy();

    expect(session?.tokenHash).not.toBe(
      body.data.refreshToken,
    );

    const securityEvents =
      await prisma.securityEvent.findMany({
        where: {
          userId: registerBody.data.userId,
          type: "LOGIN_SUCCESS",
        },
      });

    expect(securityEvents).toHaveLength(1);
  });

  it("returns INVALID_CREDENTIALS for wrong password", async () => {
    const email = "wrong-password@example.com";
    const password = "StrongPassword123!";
    const accountType = "USER";

    const registerResponse = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        email,
        password,
        accountType,
      },
    });

    expect(registerResponse.statusCode).toBe(201);

    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      remoteAddress: TEST_REMOTE_ADDRESS,
      payload: {
        email,
        password: "WrongPassword123!",
      },
    });

    expect(response.statusCode).toBe(401);

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
      "INVALID_CREDENTIALS",
    );

    expect(body.error.message).toBe(
      "Invalid email or password",
    );

    expect(body.error.details).toBeNull();

    expect(body.error.requestId).toEqual(
      expect.any(String),
    );
  });

  it("returns INVALID_CREDENTIALS for unknown email", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      remoteAddress: TEST_REMOTE_ADDRESS, 
      payload: {
        email: "does-not-exist@example.com",
        password: "StrongPassword123!",
      },
    });

    expect(response.statusCode).toBe(401);

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
      "INVALID_CREDENTIALS",
    );

    expect(body.error.message).toBe(
      "Invalid email or password",
    );

    expect(body.error.details).toBeNull();

    expect(body.error.requestId).toEqual(
      expect.any(String),
    );
  });

  it("returns VALIDATION_ERROR for invalid email", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      remoteAddress: TEST_REMOTE_ADDRESS,
      payload: {
        email: "not-an-email",
        password: "StrongPassword123!",
      },
    });

    expect(response.statusCode).toBe(400);

    const body = response.json<{
      success: boolean;
      error: {
        code: string;
        requestId: string;
        details: unknown;
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

  it("returns RATE_LIMITED when the login IP limit is exceeded", async () => {
    const email = "rate-limit@example.com";
    const password = "StrongPassword123!";
    const accountType = "USER";

    const registerResponse =
      await app.inject({
        method: "POST",
        url: "/v1/auth/register",
        payload: {
          email,
          password,
          accountType,
        },
      });

    expect(registerResponse.statusCode).toBe(201);

    for (let index = 0; index < 20; index += 1) {
      const response = await app.inject({
        method: "POST",
        url: "/v1/auth/login",
        remoteAddress: TEST_REMOTE_ADDRESS,
        payload: {
          email,
          password: "WrongPassword123!",
        },
      });

      expect([401, 429]).toContain(
        response.statusCode,
      );

      if (response.statusCode === 429) {
        break;
      }
    }

    const blockedResponse =
      await app.inject({
        method: "POST",
        url: "/v1/auth/login",
        remoteAddress: TEST_REMOTE_ADDRESS,
        payload: {
          email,
          password: "WrongPassword123!",
        },
      });

    expect(
      blockedResponse.statusCode,
    ).toBe(429);

    expect(
      blockedResponse.headers["retry-after"],
    ).toEqual(expect.any(String));

    const body =
      blockedResponse.json();

    expect(body.success).toBe(false);

    expect(body.error.code).toBe(
      "RATE_LIMITED",
    );
  });
});