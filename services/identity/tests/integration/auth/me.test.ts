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

const TEST_REMOTE_ADDRESS =
  "127.0.0.2";

describe("GET /v1/auth/me", () => {
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

  it("returns the current user", async () => {
    const email = "me@example.com";
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
    }>();

    const loginResponse = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      remoteAddress: TEST_REMOTE_ADDRESS,
      payload: {
        email,
        password,
      },
    });

    expect(loginResponse.statusCode).toBe(200);

    const loginBody = loginResponse.json<{
      success: boolean;
      data: {
        user: {
          userId: string;
        };
        accessToken: string;
      };
    }>();

    expect(loginBody.data.user.userId).toBe(
      registerBody.data.userId,
    );

    const response = await app.inject({
      method: "GET",
      url: "/v1/auth/me",
      headers: {
        authorization: `Bearer ${loginBody.data.accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json<{
      success: boolean;
      data: {
        userId: string;
        status: string;
      };
      meta: {
        requestId: string;
      };
    }>();

    expect(body.success).toBe(true);

    expect(body.data).toEqual({
      userId: registerBody.data.userId,
      status: "ACTIVE",
    });

    expect(body.meta.requestId).toEqual(
      expect.any(String),
    );
  });

  it("returns UNAUTHORIZED when authorization header is missing", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/v1/auth/me",
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
      "UNAUTHORIZED",
    );

    expect(body.error.details).toBeNull();

    expect(body.error.requestId).toEqual(
      expect.any(String),
    );
  });

  it("returns UNAUTHORIZED for invalid access token", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/v1/auth/me",
      headers: {
        authorization: "Bearer invalid-token",
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
      "UNAUTHORIZED",
    );

    expect(body.error.details).toBeNull();

    expect(body.error.requestId).toEqual(
      expect.any(String),
    );
  });

  it("returns UNAUTHORIZED for malformed authorization header", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/v1/auth/me",
      headers: {
        authorization: "Token something",
      },
    });

    expect(response.statusCode).toBe(401);

    const body = response.json<{
      success: boolean;
      error: {
        code: string;
      };
    }>();

    expect(body.success).toBe(false);

    expect(body.error.code).toBe(
      "UNAUTHORIZED",
    );
  });
});