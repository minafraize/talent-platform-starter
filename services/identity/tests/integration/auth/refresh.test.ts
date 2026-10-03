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

describe("POST /v1/auth/refresh", () => {
  const app = buildApp();
  const TEST_REMOTE_ADDRESS = "127.0.0.5";

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

  it("rotates the refresh token", async () => {
    const email = "refresh@example.com";
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
        refreshToken: string;
        expiresAt: string;
      };
    }>();

    const oldRefreshToken =
      loginBody.data.refreshToken;

    const oldHash = hashToken(oldRefreshToken);

    const beforeSession =
      await prisma.session.findUnique({
        where: {
          tokenHash: oldHash,
        },
      });

    expect(beforeSession).not.toBeNull();
    expect(beforeSession?.status).toBe(
      "ACTIVE",
    );

    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/refresh",
      payload: {
        refreshToken: oldRefreshToken,
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json<{
      success: boolean;
      data: {
        accessToken: string;
        refreshToken: string;
        expiresAt: string;
      };
      meta: {
        requestId: string;
      };
    }>();

    expect(body.success).toBe(true);

    expect(body.data.accessToken).toEqual(
      expect.any(String),
    );

    expect(body.data.refreshToken).toEqual(
      expect.any(String),
    );

    expect(body.data.expiresAt).toEqual(
      expect.any(String),
    );

    expect(body.data.refreshToken).not.toBe(
      oldRefreshToken,
    );

    expect(body.meta.requestId).toEqual(
      expect.any(String),
    );

    const newHash = hashToken(
      body.data.refreshToken,
    );

    const rotatedSession =
      await prisma.session.findUnique({
        where: {
          id: beforeSession!.id,
        },
      });

    expect(rotatedSession).not.toBeNull();

    expect(rotatedSession?.status).toBe(
      "ACTIVE",
    );

    expect(rotatedSession?.tokenHash).toBe(
      newHash,
    );

    expect(rotatedSession?.tokenHash).not.toBe(
      oldHash,
    );

    const oldTokenResponse =
      await app.inject({
        method: "POST",
        url: "/v1/auth/refresh",
        payload: {
          refreshToken: oldRefreshToken,
        },
      });

    expect(oldTokenResponse.statusCode).toBe(
      401,
    );

    const oldTokenBody =
      oldTokenResponse.json<{
        success: boolean;
        error: {
          code: string;
        };
      }>();

    expect(oldTokenBody.success).toBe(false);

    expect(oldTokenBody.error.code).toBe(
      "UNAUTHORIZED",
    );

    const newTokenResponse =
      await app.inject({
        method: "POST",
        url: "/v1/auth/refresh",
        payload: {
          refreshToken:
            body.data.refreshToken,
        },
      });

    expect(newTokenResponse.statusCode).toBe(
      200,
    );
  });

  it("rejects an unknown refresh token", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/refresh",
      payload: {
        refreshToken:
          "this-is-not-a-valid-refresh-token",
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

  it("allows only one concurrent refresh request to rotate a token", async () => {
    const email = "refresh-race@example.com";
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
        refreshToken: string;
        };
    }>();

    const refreshToken =
        loginBody.data.refreshToken;

    const [first, second] = await Promise.all([
        app.inject({
        method: "POST",
        url: "/v1/auth/refresh",
        payload: {
            refreshToken,
        },
        }),

        app.inject({
        method: "POST",
        url: "/v1/auth/refresh",
        payload: {
            refreshToken,
        },
        }),
    ]);

    const statuses = [
        first.statusCode,
        second.statusCode,
    ].sort();

    expect(statuses).toEqual([200, 401]);

    const successfulResponse =
        first.statusCode === 200
        ? first
        : second;

    const successfulBody =
        successfulResponse.json<{
        success: boolean;
        data: {
            refreshToken: string;
        };
        }>();

    expect(
        successfulBody.data.refreshToken,
    ).not.toBe(refreshToken);
});

it("does not create more than one rotated token during concurrent refresh", async () => {
    const email = "refresh-race@example.com";
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

    expect(registerBody.success).toBe(true);

    const userId = registerBody.data.userId;

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

    expect(loginBody.success).toBe(true);

    const refreshToken =
        loginBody.data.refreshToken;

    const [first, second] = await Promise.all([
        app.inject({
        method: "POST",
        url: "/v1/auth/refresh",
        payload: {
            refreshToken,
        },
        }),

        app.inject({
        method: "POST",
        url: "/v1/auth/refresh",
        payload: {
            refreshToken,
        },
        }),
    ]);

    const statuses = [
        first.statusCode,
        second.statusCode,
    ].sort();

    expect(statuses).toEqual([200, 401]);

    const successfulResponse =
        first.statusCode === 200
        ? first
        : second;

    const successfulBody =
        successfulResponse.json<{
        success: boolean;
        data: {
            refreshToken: string;
        };
        }>();

    expect(successfulBody.success).toBe(true);

    expect(
        successfulBody.data.refreshToken,
    ).toEqual(expect.any(String));

    expect(
        successfulBody.data.refreshToken,
    ).not.toBe(refreshToken);

    const sessions =
        await prisma.session.findMany({
        where: {
            userId,
        },
        });

    expect(sessions).toHaveLength(1);

    expect(sessions[0]?.status).toBe(
        "ACTIVE",
    );
    });
});