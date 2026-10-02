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
import { hashToken } from "../../../src/infrastructure/security/token-hash.js";

const TEST_REMOTE_ADDRESS =
  "127.0.0.3";

describe("POST /v1/auth/logout", () => {
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

  it("revokes the current session", async () => {
    const email = "logout@example.com";
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
        refreshToken: string;
      };
    }>();

    const refreshToken =
      loginBody.data.refreshToken;

    const tokenHash = hashToken(refreshToken);

    const sessionBefore =
      await prisma.session.findUnique({
        where: {
          tokenHash,
        },
      });

    expect(sessionBefore).not.toBeNull();

    expect(sessionBefore?.status).toBe(
      "ACTIVE",
    );

    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/logout",
      payload: {
        refreshToken,
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json<{
      success: boolean;
      data: null;
      meta: {
        requestId: string;
      };
    }>();

    expect(body.success).toBe(true);
    expect(body.data).toBeNull();

    expect(body.meta.requestId).toEqual(
      expect.any(String),
    );

    const sessionAfter =
      await prisma.session.findUnique({
        where: {
          id: sessionBefore!.id,
        },
      });

    expect(sessionAfter).not.toBeNull();

    expect(sessionAfter?.status).toBe(
      "REVOKED",
    );

    expect(sessionAfter?.revokedAt).not.toBeNull();

    const refreshAfterLogout =
      await app.inject({
        method: "POST",
        url: "/v1/auth/refresh",
        payload: {
          refreshToken,
        },
      });

    expect(
      refreshAfterLogout.statusCode,
    ).toBe(401);

    const securityEvents =
      await prisma.securityEvent.findMany({
        where: {
          userId:
            loginBody.data.user.userId,
          type: "LOGOUT",
        },
      });

    expect(securityEvents).toHaveLength(1);
  });

  it("returns UNAUTHORIZED for an unknown refresh token", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/logout",
      payload: {
        refreshToken:
          "unknown-refresh-token",
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

    expect(body.error.message).toBe(
      "Invalid refresh token",
    );

    expect(body.error.details).toBeNull();

    expect(body.error.requestId).toEqual(
      expect.any(String),
    );
  });

  it("is idempotent when logging out an already revoked session", async () => {
    const email = "logout-idempotent@example.com";
    const password = "StrongPassword123!";
    const accountType = "USER";

    await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        email,
        password,
        accountType,
      },
    });

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
        refreshToken: string;
      };
    }>();

    const refreshToken =
      loginBody.data.refreshToken;

    const firstLogout =
      await app.inject({
        method: "POST",
        url: "/v1/auth/logout",
        payload: {
          refreshToken,
        },
      });

    expect(firstLogout.statusCode).toBe(200);

    const secondLogout =
      await app.inject({
        method: "POST",
        url: "/v1/auth/logout",
        payload: {
          refreshToken,
        },
      });

    expect(secondLogout.statusCode).toBe(200);
  });
});