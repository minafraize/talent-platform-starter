import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import Fastify, {
  type FastifyInstance,
} from "fastify";

import { randomUUID } from "node:crypto";

import { SignJWT } from "jose";

import {
  profileRoutes,
} from "../../src/presentation/http/profile.routes.js";

import {
  prisma,
} from "../../src/infrastructure/database/prisma.js";

const TEST_USER_ID =
  randomUUID();

const SECOND_USER_ID =
  randomUUID();

const TEST_USERNAME =
  `mina_${randomUUID().slice(0, 8)}`;

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
    .sign(new TextEncoder().encode(secret));
  }

describe(
  "Profile update API",
  () => {
    beforeAll(async () => {
      app = Fastify({
        logger: false,
      });

      /**
       * Minimal error handler for the integration
       * test environment.
       */
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

      accessToken =
        await createTestAccessToken(
          TEST_USER_ID,
        );

      await app.ready();
    });

    beforeEach(async () => {
      await prisma.profile.deleteMany();

      await prisma.talentProfile.deleteMany();

      await prisma.professionalProfile.deleteMany();

      await prisma.account.deleteMany();

      await prisma.account.create({
        data: {
          userId: TEST_USER_ID,
          type: "TALENT",
          status: "ACTIVE",

          profile: {
            create: {
              username: TEST_USERNAME,
              displayName:
                "Old Name",
              bio: "Old Bio",
              countryCode: "EG",
              city: "Cairo",
            },
          },

          talentProfile: {
            create: {
              score: 0,
              status: "ACTIVE",
            },
          },
        },
      });
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
      "Test 1 - updates profile and returns 200",
      async () => {
        const response =
          await app.inject({
            method: "PATCH",
            url: "/v1/profile/me",
            headers: {
              authorization: `Bearer ${accessToken}`,
            },

            payload: {
              username:
                TEST_USERNAME,
              displayName:
                "Mina Fraiz",
              bio:
                "Frontend Developer",
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
        ).toBe("Mina Fraiz");

        expect(
          body.data.bio,
        ).toBe("Frontend Developer");

        expect(
          body.data.countryCode,
        ).toBe("EG");

        expect(
          body.data.city,
        ).toBe("Cairo");
      },
    );

    it(
      "Test 2 - partial update keeps omitted fields unchanged",
      async () => {
        const response =
          await app.inject({
            method: "PATCH",
            url: "/v1/profile/me",
            headers: {
              authorization: `Bearer ${accessToken}`,
            },

            payload: {
              displayName:
                "New Display Name",
            },
          });

        expect(
          response.statusCode,
        ).toBe(200);

        const profile =
          await prisma.profile.findUnique({
            where: {
              username:
                TEST_USERNAME,
            },
          });

        expect(
          profile,
        ).not.toBeNull();

        expect(
          profile?.displayName,
        ).toBe(
          "New Display Name",
        );

        expect(
          profile?.username,
        ).toBe(TEST_USERNAME);

        expect(
          profile?.bio,
        ).toBe("Old Bio");

        expect(
          profile?.city,
        ).toBe("Cairo");
      },
    );

    it(
      "Test 3 - rejects empty PATCH with PROFILE_UPDATE_EMPTY",
      async () => {
        const response =
          await app.inject({
            method: "PATCH",
            url: "/v1/profile/me",
            headers: {
              authorization: `Bearer ${accessToken}`,
            },

            payload: {},
          });

        expect(
          response.statusCode,
        ).toBe(400);

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
        ).toBe(
          "PROFILE_UPDATE_EMPTY",
        );
      },
    );

    it(
      "Test 4 - rejects an already used username",
      async () => {
        const duplicateUsername =
          `taken_${randomUUID().slice(0, 8)}`;

        await prisma.account.create({
          data: {
            userId:
              SECOND_USER_ID,
            type: "USER",
            status: "ACTIVE",

            profile: {
              create: {
                username:
                  duplicateUsername,
              },
            },
          },
        });

        const response =
          await app.inject({
            method: "PATCH",
            url: "/v1/profile/me",
            headers: {
              authorization: `Bearer ${accessToken}`,
            },

            payload: {
              username:
                duplicateUsername,
            },
          });

        expect(
          response.statusCode,
        ).toBe(409);

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
        ).toBe(
          "USERNAME_ALREADY_EXISTS",
        );
      },
    );

    it(
      "Test 5 - GET /v1/profile/me returns the updated profile",
      async () => {
        await app.inject({
          method: "PATCH",
          url: "/v1/profile/me",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },

          payload: {
            displayName:
              "Updated Mina",

            bio:
              "Frontend Engineer",

            city:
              "Cairo",
          },
        });

        const response =
          await app.inject({
            method: "GET",
            url: "/v1/profile/me",
            headers: {
              authorization: `Bearer ${accessToken}`,
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
        ).toBe("Updated Mina");

        expect(
          body.data.bio,
        ).toBe("Frontend Engineer");

        expect(
          body.data.city,
        ).toBe("Cairo");
      },
    );
  },
);
