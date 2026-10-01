import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";

import Fastify, {
  type FastifyInstance,
} from "fastify";

import { randomUUID } from "node:crypto";
import { SignJWT } from "jose";

import { profileRoutes } from "../../src/presentation/http/profile.routes.js";
import { prisma } from "../../src/infrastructure/database/prisma.js";

const TEST_USER_ID = randomUUID();

const TEST_USERNAME =
  `e2e_${randomUUID().slice(0, 8)}`;

let app: FastifyInstance;
let accessToken: string;

async function createTestAccessToken(
  userId: string,
): Promise<string> {
  const secret =
    process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is not defined",
    );
  }

  if (secret.length < 32) {
    throw new Error(
      "ACCESS_TOKEN_SECRET must be at least 32 characters",
    );
  }

  const issuer =
    process.env.ACCESS_TOKEN_ISSUER ??
    "talent-platform";

  const audience =
    process.env.ACCESS_TOKEN_AUDIENCE ??
    "talent-platform-api";

  return new SignJWT({
    sid: randomUUID(),
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(userId)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(
      new TextEncoder().encode(secret),
    );
}

describe(
  "Authenticated Profile E2E",
  () => {
    beforeAll(async () => {
      app = Fastify({
        logger: false,
      });

      app.setErrorHandler(
        async (
          error,
          _request,
          reply,
        ) => {
          const typedError =
            error as Error & {
              code?: string;
              statusCode?: number;
              details?: unknown;
            };

          return reply
            .code(
              typedError.statusCode ??
                500,
            )
            .send({
              success: false,
              error: {
                code:
                  typedError.code ??
                  "INTERNAL_SERVER_ERROR",
                message:
                  typedError.message,
                details:
                  typedError.details ??
                  null,
              },
            });
        },
      );

      await app.register(
        profileRoutes,
      );

      await app.ready();

      await prisma.profile.deleteMany();
      await prisma.talentProfile.deleteMany();
      await prisma.professionalProfile.deleteMany();
      await prisma.account.deleteMany();

      await prisma.account.create({
        data: {
          userId: TEST_USER_ID,
          type: "USER",
          status: "ACTIVE",
          profile: {
            create: {
              username: TEST_USERNAME,
              displayName: "E2E User",
              bio: "Initial E2E Bio",
              countryCode: "EG",
              city: "Cairo",
            },
          },
        },
      });

      accessToken =
        await createTestAccessToken(
          TEST_USER_ID,
        );
    });

    afterAll(async () => {
      await app.close();

      await prisma.profile.deleteMany();
      await prisma.talentProfile.deleteMany();
      await prisma.professionalProfile.deleteMany();
      await prisma.account.deleteMany();

      await prisma.$disconnect();
    });

    it(
      "returns the current profile with a valid access token",
      async () => {
        const response =
          await app.inject({
            method: "GET",
            url: "/v1/profile/me",
            headers: {
              authorization:
                `Bearer ${accessToken}`,
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
              username: string | null;
              displayName:
                | string
                | null;
              bio: string | null;
              countryCode:
                | string
                | null;
              city: string | null;
            };
          }>();

        expect(
          body.success,
        ).toBe(true);

        expect(
          body.data.userId,
        ).toBe(TEST_USER_ID);

        expect(
          body.data.username,
        ).toBe(TEST_USERNAME);

        expect(
          body.data.displayName,
        ).toBe("E2E User");

        expect(
          body.data.bio,
        ).toBe("Initial E2E Bio");

        expect(
          body.data.countryCode,
        ).toBe("EG");

        expect(
          body.data.city,
        ).toBe("Cairo");
      },
    );

    it(
      "updates the current profile with a valid access token",
      async () => {
        const response =
          await app.inject({
            method: "PATCH",
            url: "/v1/profile/me",
            headers: {
              authorization:
                `Bearer ${accessToken}`,
            },
            payload: {
              displayName:
                "Authenticated User",
              bio:
                "Updated through authenticated E2E",
              countryCode: "eg",
              city: "Cairo",
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
              username: string | null;
              displayName:
                | string
                | null;
              bio: string | null;
              countryCode:
                | string
                | null;
              city: string | null;
            };
          }>();

        expect(
          body.success,
        ).toBe(true);

        expect(
          body.data.userId,
        ).toBe(TEST_USER_ID);

        expect(
          body.data.username,
        ).toBe(TEST_USERNAME);

        expect(
          body.data.displayName,
        ).toBe(
          "Authenticated User",
        );

        expect(
          body.data.bio,
        ).toBe(
          "Updated through authenticated E2E",
        );

        expect(
          body.data.countryCode,
        ).toBe("EG");

        expect(
          body.data.city,
        ).toBe("Cairo");
      },
    );

    it(
      "rejects a request without authorization",
      async () => {
        const response =
          await app.inject({
            method: "GET",
            url: "/v1/profile/me",
          });

        expect(
          response.statusCode,
        ).toBe(401);
      },
    );

    it(
      "rejects a malformed authorization header",
      async () => {
        const response =
          await app.inject({
            method: "GET",
            url: "/v1/profile/me",
            headers: {
              authorization:
                "Basic invalid-token",
            },
          });

        expect(
          response.statusCode,
        ).toBe(401);
      },
    );

    it(
      "rejects an invalid access token",
      async () => {
        const response =
          await app.inject({
            method: "GET",
            url: "/v1/profile/me",
            headers: {
              authorization:
                "Bearer invalid-token",
            },
          });

        expect(
          response.statusCode,
        ).toBe(401);
      },
    );
  },
);
