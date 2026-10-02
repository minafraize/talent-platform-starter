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

const identityBaseUrl =
  process.env.E2E_IDENTITY_BASE_URL ??
  "http://127.0.0.1:4001";

const registerPath =
  process.env.E2E_REGISTER_PATH ??
  "/v1/auth/register";

const loginPath =
  process.env.E2E_LOGIN_PATH ??
  "/v1/auth/login";

const upgradePath =
  process.env.E2E_UPGRADE_PATH ??
  "/v1/account/upgrade";

const PASSWORD = "StrongPassword123!";

const createdUserIds = new Set<string>();

interface RegisterResponse {
  success: boolean;
  data: {
    userId: string;
  };
}

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

interface UpgradeResponse {
  success: boolean;
  data: {
    userId: string;
    previousAccountType: string;
    newAccountType: string;
  };
}

async function registerUser(
  accountType:
    | "USER"
    | "TALENT"
    | "PROFESSIONAL",
): Promise<RegisterResponse> {
  const email =
    `upgrade-e2e-${accountType.toLowerCase()}-${randomUUID()}@example.com`;

  const response = await fetch(
    `${identityBaseUrl}${registerPath}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: PASSWORD,
        accountType,
      }),
    },
  );

  const responseText =
    await response.text();

  expect(
    response.status,
    `Registration failed: ${responseText}`,
  ).toBe(201);

  const body =
    JSON.parse(
      responseText,
    ) as RegisterResponse;

  expect(body.success).toBe(true);
  expect(body.data.userId).toEqual(
    expect.any(String),
  );

  return body;
}

async function registerAndLogin(
  accountType:
    | "USER"
    | "TALENT"
    | "PROFESSIONAL",
): Promise<{
  userId: string;
  accessToken: string;
}> {
  const email =
    `upgrade-e2e-${accountType.toLowerCase()}-${randomUUID()}@example.com`;

  const registerResponse =
    await fetch(
      `${identityBaseUrl}${registerPath}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: PASSWORD,
          accountType,
        }),
      },
    );

  const registerText =
    await registerResponse.text();

  expect(
    registerResponse.status,
    `Registration failed: ${registerText}`,
  ).toBe(201);

  const registerBody =
    JSON.parse(
      registerText,
    ) as RegisterResponse;

  expect(registerBody.success).toBe(true);

  const userId =
    registerBody.data.userId;

  createdUserIds.add(userId);

  /*
   * Wait until the registration event has
   * already reached Profile.
   *
   * This proves that the initial
   * identity.user.created path works before
   * we attempt the upgrade.
   */
  await waitForProfileAccount(
    userId,
  );

  const loginResponse =
    await fetch(
      `${identityBaseUrl}${loginPath}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: PASSWORD,
        }),
      },
    );

  const loginText =
    await loginResponse.text();

  expect(
    loginResponse.status,
    `Login failed: ${loginText}`,
  ).toBe(200);

  const loginBody =
    JSON.parse(
      loginText,
    ) as LoginResponse;

  expect(loginBody.success).toBe(true);

  return {
    userId,
    accessToken:
      loginBody.data.accessToken,
  };
}

async function upgradeAccount(
  accessToken: string,
  targetAccountType:
    | "TALENT"
    | "PROFESSIONAL",
): Promise<UpgradeResponse> {
  const response = await fetch(
    `${identityBaseUrl}${upgradePath}`,
    {
      method: "POST",
      headers: {
        Authorization:
          `Bearer ${accessToken}`,
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        targetAccountType,
      }),
    },
  );

  const responseText =
    await response.text();

  expect(
    response.status,
    `Upgrade failed: ${responseText}`,
  ).toBe(200);

  const body =
    JSON.parse(
      responseText,
    ) as UpgradeResponse;

  expect(body.success).toBe(true);

  return body;
}

async function waitFor(
  condition: () => Promise<boolean>,
  timeoutMs = 20_000,
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
      setTimeout(
        resolve,
        intervalMs,
      );
    });
  }

  throw new Error(
    `Condition was not satisfied within ${timeoutMs}ms`,
  );
}

async function waitForProfileAccount(
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

async function waitForAccountType(
  userId: string,
  expectedType:
    | "USER"
    | "TALENT"
    | "PROFESSIONAL",
): Promise<void> {
  await waitFor(
    async () => {
      const account =
        await prisma.account.findUnique({
          where: {
            userId,
          },
        });

      return (
        account?.type ===
        expectedType
      );
    },
  );
}

describe(
  "Account upgrade full E2E",
  () => {
    let consumerRuntime:
      | ProfileEventsConsumerRuntime
      | undefined;

    beforeAll(async () => {
      consumerRuntime =
        await startProfileEventsConsumer(
          prisma,
          {
            topic:
              process.env.KAFKA_IDENTITY_TOPIC ??
              "identity.events",

            groupId:
              `profile-upgrade-e2e-${randomUUID()}`,

            fromBeginning: false,

            waitForReady: true,

            readyTimeoutMs: 10_000,
          },
        );
    });

    afterAll(async () => {
      await consumerRuntime?.stop();

      for (
        const userId of createdUserIds
      ) {
        await prisma.account.deleteMany({
          where: {
            userId,
          },
        });
      }

      await prisma.$disconnect();
    });

    it(
      "completes USER -> TALENT through Outbox -> Kafka -> Profile",
      async () => {
        const {
          userId,
          accessToken,
        } = await registerAndLogin(
          "USER",
        );

        const upgrade =
          await upgradeAccount(
            accessToken,
            "TALENT",
          );

        expect(upgrade.data).toEqual({
          userId,
          previousAccountType:
            "USER",
          newAccountType:
            "TALENT",
        });

        await waitForAccountType(
          userId,
          "TALENT",
        );

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

        expect(account?.type).toBe(
          "TALENT",
        );

        expect(
          account?.profile,
        ).not.toBeNull();

        expect(
          account?.talentProfile,
        ).not.toBeNull();

        expect(
          account?.talentProfile?.status,
        ).toBe("ACTIVE");

        expect(
          account?.talentProfile?.score,
        ).toBe(0);

        expect(
          account?.professionalProfile,
        ).toBeNull();

        const processedEvent =
          await prisma.processedEvent.findFirst({
            where: {
              eventType:
                "identity.account.type.changed",
            },
            orderBy: {
              processedAt: "desc",
            },
          });

        expect(
          processedEvent,
        ).not.toBeNull();
      },
      30_000,
    );

    it(
      "completes USER -> PROFESSIONAL through Outbox -> Kafka -> Profile",
      async () => {
        const {
          userId,
          accessToken,
        } = await registerAndLogin(
          "USER",
        );

        const upgrade =
          await upgradeAccount(
            accessToken,
            "PROFESSIONAL",
          );

        expect(upgrade.data).toEqual({
          userId,
          previousAccountType:
            "USER",
          newAccountType:
            "PROFESSIONAL",
        });

        await waitForAccountType(
          userId,
          "PROFESSIONAL",
        );

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

        expect(account?.type).toBe(
          "PROFESSIONAL",
        );

        expect(
          account?.profile,
        ).not.toBeNull();

        expect(
          account?.talentProfile,
        ).toBeNull();

        expect(
          account?.professionalProfile,
        ).not.toBeNull();
      },
      30_000,
    );

    it(
      "completes TALENT -> PROFESSIONAL and converts the persona",
      async () => {
        const {
          userId,
          accessToken,
        } = await registerAndLogin(
          "TALENT",
        );

        const initialAccount =
          await prisma.account.findUnique({
            where: {
              userId,
            },
            include: {
              talentProfile: true,
              professionalProfile: true,
            },
          });

        expect(
          initialAccount?.type,
        ).toBe("TALENT");

        expect(
          initialAccount?.talentProfile,
        ).not.toBeNull();

        expect(
          initialAccount?.professionalProfile,
        ).toBeNull();

        const upgrade =
          await upgradeAccount(
            accessToken,
            "PROFESSIONAL",
          );

        expect(upgrade.data).toEqual({
          userId,
          previousAccountType:
            "TALENT",
          newAccountType:
            "PROFESSIONAL",
        });

        await waitForAccountType(
          userId,
          "PROFESSIONAL",
        );

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

        expect(account?.type).toBe(
          "PROFESSIONAL",
        );

        expect(
          account?.profile,
        ).not.toBeNull();

        expect(
          account?.talentProfile,
        ).toBeNull();

        expect(
          account?.professionalProfile,
        ).not.toBeNull();
      },
      30_000,
    );
  },
);