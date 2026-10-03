import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { randomUUID } from "node:crypto";

import {
  buildApp,
} from "../../../src/app.js";

import {
  prisma,
} from "../../../src/infrastructure/database/prisma.js";

const PASSWORD =
  "StrongPassword123!";

interface LoginResponse {
  success: boolean;

  data: {
    user: {
      userId: string;
    };

    accessToken: string;

    refreshToken: string;

    expiresAt: string;
  };
}

async function registerAndLogin(
  accountType:
    | "USER"
    | "TALENT"
    | "PROFESSIONAL",
) {
  const email =
    `upgrade-${randomUUID()}@example.com`;

  const registerResponse =
    await app.inject({
      method: "POST",

      url:
        "/v1/auth/register",

      headers: {
        "content-type":
          "application/json",
      },

      payload: {
        email,

        password:
          PASSWORD,

        accountType,
      },
    });

  expect(
    registerResponse.statusCode,
  ).toBe(201);

  const registerBody =
    registerResponse.json<{
      success: boolean;

      data: {
        userId: string;
      };
    }>();

  expect(
    registerBody.success,
  ).toBe(true);

  const loginResponse =
    await app.inject({
      method: "POST",

      url:
        "/v1/auth/login",

      headers: {
        "content-type":
          "application/json",
      },

      payload: {
        email,

        password:
          PASSWORD,
      },
    });

  expect(
    loginResponse.statusCode,
  ).toBe(200);

  const loginBody =
    loginResponse.json<LoginResponse>();

  expect(
    loginBody.success,
  ).toBe(true);

  return {
    userId:
      registerBody.data.userId,

    accessToken:
      loginBody.data.accessToken,
  };
}

let app:
  ReturnType<typeof buildApp>;

describe(
  "POST /v1/account/upgrade",
  () => {
    beforeAll(async () => {
      app =
        buildApp();

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

    it(
      "upgrades USER -> TALENT",
      async () => {
        const {
          userId,
          accessToken,
        } =
          await registerAndLogin(
            "USER",
          );

        const response =
          await app.inject({
            method: "POST",

            url:
              "/v1/account/upgrade",

            headers: {
              authorization:
                `Bearer ${accessToken}`,
            },

            payload: {
              targetAccountType:
                "TALENT",
            },
          });

        expect(
          response.statusCode,
        ).toBe(200);

        const body =
          response.json<{
            success: boolean;

            data: {
              userId: string;

              previousAccountType:
                string;

              newAccountType:
                string;
            };
          }>();

        expect(body).toEqual({
          success: true,

          data: {
            userId,

            previousAccountType:
              "USER",

            newAccountType:
              "TALENT",
          },
        });

        const user =
          await prisma.user.findUnique({
            where: {
              id: userId,
            },

            select: {
              accountType:
                true,
            },
          });

        expect(
          user?.accountType,
        ).toBe("TALENT");

        const event =
          await prisma.outboxEvent.findFirst({
            where: {
              eventType:
                "identity.account.type.changed",

              aggregateId:
                userId,
            },
          });

        expect(
          event,
        ).not.toBeNull();

        expect(
          event?.payload,
        ).toEqual({
          userId,

          previousAccountType:
            "USER",

          newAccountType:
            "TALENT",
        });
      },
    );

    it(
      "upgrades USER -> PROFESSIONAL",
      async () => {
        const {
          userId,
          accessToken,
        } =
          await registerAndLogin(
            "USER",
          );

        const response =
          await app.inject({
            method: "POST",

            url:
              "/v1/account/upgrade",

            headers: {
              authorization:
                `Bearer ${accessToken}`,
            },

            payload: {
              targetAccountType:
                "PROFESSIONAL",
            },
          });

        expect(
          response.statusCode,
        ).toBe(200);

        const user =
          await prisma.user.findUnique({
            where: {
              id: userId,
            },

            select: {
              accountType:
                true,
            },
          });

        expect(
          user?.accountType,
        ).toBe(
          "PROFESSIONAL",
        );
      },
    );

    it(
      "upgrades TALENT -> PROFESSIONAL",
      async () => {
        const {
          userId,
          accessToken,
        } =
          await registerAndLogin(
            "TALENT",
          );

        const response =
          await app.inject({
            method: "POST",

            url:
              "/v1/account/upgrade",

            headers: {
              authorization:
                `Bearer ${accessToken}`,
            },

            payload: {
              targetAccountType:
                "PROFESSIONAL",
            },
          });

        expect(
          response.statusCode,
        ).toBe(200);

        const user =
          await prisma.user.findUnique({
            where: {
              id: userId,
            },

            select: {
              accountType:
                true,
            },
          });

        expect(
          user?.accountType,
        ).toBe(
          "PROFESSIONAL",
        );
      },
    );

    it(
      "is idempotent when the requested target is already the current account type",
      async () => {
        const {
          userId,
          accessToken,
        } =
          await registerAndLogin(
            "USER",
          );

        const firstResponse =
          await app.inject({
            method: "POST",

            url:
              "/v1/account/upgrade",

            headers: {
              authorization:
                `Bearer ${accessToken}`,
            },

            payload: {
              targetAccountType:
                "TALENT",
            },
          });

        expect(
          firstResponse.statusCode,
        ).toBe(200);

        const firstEventCount =
          await prisma.outboxEvent.count({
            where: {
              eventType:
                "identity.account.type.changed",

              aggregateId:
                userId,
            },
          });

        expect(
          firstEventCount,
        ).toBe(1);

        const secondResponse =
          await app.inject({
            method: "POST",

            url:
              "/v1/account/upgrade",

            headers: {
              authorization:
                `Bearer ${accessToken}`,
            },

            payload: {
              targetAccountType:
                "TALENT",
            },
          });

        expect(
          secondResponse.statusCode,
        ).toBe(200);

        const secondBody =
          secondResponse.json<{
            success: boolean;

            data: {
              userId: string;

              previousAccountType:
                string;

              newAccountType:
                string;
            };
          }>();

        expect(
          secondBody,
        ).toEqual({
          success: true,

          data: {
            userId,

            previousAccountType:
              "TALENT",

            newAccountType:
              "TALENT",
          },
        });

        const secondEventCount =
          await prisma.outboxEvent.count({
            where: {
              eventType:
                "identity.account.type.changed",

              aggregateId:
                userId,
            },
          });

        expect(
          secondEventCount,
        ).toBe(1);
      },
    );

    it(
      "rejects upgrade for a suspended account",
      async () => {
        const {
          userId,
          accessToken,
        } =
          await registerAndLogin(
            "USER",
          );

        await prisma.user.update({
          where: {
            id: userId,
          },

          data: {
            status:
              "SUSPENDED",
          },
        });

        const response =
          await app.inject({
            method: "POST",

            url:
              "/v1/account/upgrade",

            headers: {
              authorization:
                `Bearer ${accessToken}`,
            },

            payload: {
              targetAccountType:
                "TALENT",
            },
          });

        expect(
          response.statusCode,
        ).toBe(403);

        const body =
          response.json<{
            success: boolean;

            error: {
              code: string;
              message: string;
            };
          }>();

        expect(
          body.success,
        ).toBe(false);

        expect(
          body.error.code,
        ).toBe("FORBIDDEN");

        expect(
          body.error.message,
        ).toBe(
          "Suspended accounts cannot be upgraded",
        );

        const user =
          await prisma.user.findUnique({
            where: {
              id: userId,
            },

            select: {
              status: true,

              accountType:
                true,
            },
          });

        expect(
          user?.status,
        ).toBe("SUSPENDED");

        expect(
          user?.accountType,
        ).toBe("USER");

        const eventCount =
          await prisma.outboxEvent.count({
            where: {
              aggregateId: userId,
              eventType: "identity.account.type.changed",
            },
          });

        expect(
          eventCount,
        ).toBe(0);
      },
    );

    it(
      "rejects upgrade for a deleted account",
      async () => {
        const {
          userId,
          accessToken,
        } =
          await registerAndLogin(
            "USER",
          );

        await prisma.user.update({
          where: {
            id: userId,
          },

          data: {
            status:
              "DELETED",

            deletedAt:
              new Date(),
          },
        });

        const response =
          await app.inject({
            method: "POST",

            url:
              "/v1/account/upgrade",

            headers: {
              authorization:
                `Bearer ${accessToken}`,
            },

            payload: {
              targetAccountType:
                "TALENT",
            },
          });

        expect(
          response.statusCode,
        ).toBe(403);

        const body =
          response.json<{
            success: boolean;

            error: {
              code: string;
              message: string;
            };
          }>();

        expect(
          body.success,
        ).toBe(false);

        expect(
          body.error.code,
        ).toBe("FORBIDDEN");

        expect(
          body.error.message,
        ).toBe(
          "Deleted accounts cannot be upgraded",
        );

        const user =
          await prisma.user.findUnique({
            where: {
              id: userId,
            },

            select: {
              status: true,

              accountType:
                true,
            },
          });

        expect(
          user?.status,
        ).toBe("DELETED");

        expect(
          user?.accountType,
        ).toBe("USER");

        const eventCount =
          await prisma.outboxEvent.count({
            where: {
              aggregateId: userId,
              eventType: "identity.account.type.changed",
            },
          });

        expect(
          eventCount,
        ).toBe(0);
      },
    );

    it(
      "rejects TALENT -> USER",
      async () => {
        const {
          userId,
          accessToken,
        } =
          await registerAndLogin(
            "TALENT",
          );

        const response =
          await app.inject({
            method: "POST",

            url:
              "/v1/account/upgrade",

            headers: {
              authorization:
                `Bearer ${accessToken}`,
            },

            payload: {
              targetAccountType:
                "USER",
            },
          });

        expect(
          response.statusCode,
        ).toBe(409);

        const user =
          await prisma.user.findUnique({
            where: {
              id: userId,
            },

            select: {
              accountType:
                true,
            },
          });

        expect(
          user?.accountType,
        ).toBe("TALENT");

        const event =
          await prisma.outboxEvent.findFirst({
            where: {
              eventType:
                "identity.account.type.changed",

              aggregateId:
                userId,
            },
          });

        expect(
          event,
        ).toBeNull();
      },
    );

    it(
      "rejects PROFESSIONAL -> TALENT",
      async () => {
        const {
          userId,
          accessToken,
        } =
          await registerAndLogin(
            "PROFESSIONAL",
          );

        const response =
          await app.inject({
            method: "POST",

            url:
              "/v1/account/upgrade",

            headers: {
              authorization:
                `Bearer ${accessToken}`,
            },

            payload: {
              targetAccountType:
                "TALENT",
            },
          });

        expect(
          response.statusCode,
        ).toBe(409);

        const user =
          await prisma.user.findUnique({
            where: {
              id: userId,
            },

            select: {
              accountType:
                true,
            },
          });

        expect(
          user?.accountType,
        ).toBe(
          "PROFESSIONAL",
        );
      },
    );

    it(
      "rejects USER -> USER",
      async () => {
        const {
          userId,
          accessToken,
        } =
          await registerAndLogin(
            "USER",
          );

        const response =
          await app.inject({
            method: "POST",

            url:
              "/v1/account/upgrade",

            headers: {
              authorization:
                `Bearer ${accessToken}`,
            },

            payload: {
              targetAccountType:
                "USER",
            },
          });

        expect(
          response.statusCode,
        ).toBe(409);

        const user =
          await prisma.user.findUnique({
            where: {
              id: userId,
            },

            select: {
              accountType:
                true,
            },
          });

        expect(
          user?.accountType,
        ).toBe("USER");

        const eventCount =
          await prisma.outboxEvent.count({
            where: {
              aggregateId: userId,
              eventType: "identity.account.type.changed",
            },
          });

        expect(
          eventCount,
        ).toBe(0);
      },
    );

    it(
      "rejects an upgrade without authentication",
      async () => {
        const response =
          await app.inject({
            method: "POST",

            url:
              "/v1/account/upgrade",

            payload: {
              targetAccountType:
                "TALENT",
            },
          });

        expect(
          response.statusCode,
        ).toBe(401);
      },
    );

    it(
      "rejects invalid authorization",
      async () => {
        const response =
          await app.inject({
            method: "POST",

            url:
              "/v1/account/upgrade",

            headers: {
              authorization:
                "Bearer invalid-token",
            },

            payload: {
              targetAccountType:
                "TALENT",
            },
          });

        expect(
          response.statusCode,
        ).toBe(401);
      },
    );
  },
);