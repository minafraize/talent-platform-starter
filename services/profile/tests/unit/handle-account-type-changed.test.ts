import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  HandleAccountTypeChangedUseCase,
} from "../../src/application/use-cases/handle-account-type-changed.js";

function createEvent(input: {
  userId: string;
  previousAccountType:
    | "USER"
    | "TALENT"
    | "PROFESSIONAL";
  newAccountType:
    | "USER"
    | "TALENT"
    | "PROFESSIONAL";
}) {
  return {
    eventId: crypto.randomUUID(),
    eventType:
      "identity.account.type.changed" as const,
    version: 1 as const,
    producer:
      "identity-service" as const,
    occurredAt:
      new Date().toISOString(),
    aggregateId: input.userId,
    payload: {
      userId: input.userId,
      previousAccountType:
        input.previousAccountType,
      newAccountType:
        input.newAccountType,
    },
  };
}

function createPrismaMock(
  account: {
    id: string;
    userId: string;
    type:
      | "USER"
      | "TALENT"
      | "PROFESSIONAL";
    talentProfile: unknown;
    professionalProfile: unknown;
  },
) {
  const processedEventCreateMany =
    vi.fn().mockResolvedValue({
      count: 1,
    });

  const accountFindUnique =
    vi.fn().mockResolvedValue(account);

  const accountUpdate =
    vi.fn().mockResolvedValue({
      ...account,
    });

  const talentProfileCreate =
    vi.fn().mockResolvedValue({});

  const talentProfileDelete =
    vi.fn().mockResolvedValue({});

  const professionalProfileCreate =
    vi.fn().mockResolvedValue({});

  const tx = {
    processedEvent: {
      createMany:
        processedEventCreateMany,
    },

    account: {
      findUnique:
        accountFindUnique,

      update:
        accountUpdate,
    },

    talentProfile: {
      create:
        talentProfileCreate,

      delete:
        talentProfileDelete,
    },

    professionalProfile: {
      create:
        professionalProfileCreate,
    },
  };

  const prisma = {
    $transaction:
      vi.fn(
        async (
          callback: (
            transaction: typeof tx,
          ) => Promise<unknown>,
        ) =>
          callback(tx),
      ),
  } as any;

  return {
    prisma,
    tx,
    processedEventCreateMany,
    accountFindUnique,
    accountUpdate,
    talentProfileCreate,
    talentProfileDelete,
    professionalProfileCreate,
  };
}

describe(
  "HandleAccountTypeChangedUseCase",
  () => {
    it(
      "applies a normal USER -> TALENT transition",
      async () => {
        const userId =
          crypto.randomUUID();

        const {
          prisma,
          accountUpdate,
          talentProfileCreate,
        } =
          createPrismaMock({
            id:
              crypto.randomUUID(),
            userId,
            type: "USER",
            talentProfile: null,
            professionalProfile:
              null,
          });

        const useCase =
          new HandleAccountTypeChangedUseCase(
            prisma,
          );

        const event =
          createEvent({
            userId,
            previousAccountType:
              "USER",
            newAccountType:
              "TALENT",
          });

        const result =
          await useCase.execute(
            event,
          );

        expect(result).toEqual({
          processed: true,
          outcome: "APPLIED",
        });

        expect(
          accountUpdate,
        ).toHaveBeenCalledWith({
          where: {
            id: expect.any(String),
          },
          data: {
            type: "TALENT",
          },
        });

        expect(
          talentProfileCreate,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      "applies a higher target even when an intermediate event was missed",
      async () => {
        const userId =
          crypto.randomUUID();

        const {
          prisma,
          accountUpdate,
          professionalProfileCreate,
        } =
          createPrismaMock({
            id:
              crypto.randomUUID(),
            userId,
            type: "USER",
            talentProfile: null,
            professionalProfile:
              null,
          });

        const useCase =
          new HandleAccountTypeChangedUseCase(
            prisma,
          );

        /*
         * Imagine:
         *
         * USER -> TALENT
         *
         * was permanently lost.
         *
         * Profile then receives:
         *
         * TALENT -> PROFESSIONAL
         */
        const event =
          createEvent({
            userId,
            previousAccountType:
              "TALENT",
            newAccountType:
              "PROFESSIONAL",
          });

        const result =
          await useCase.execute(
            event,
          );

        expect(result).toEqual({
          processed: true,
          outcome:
            "APPLIED_WITH_GAP",
        });

        expect(
          accountUpdate,
        ).toHaveBeenCalledWith({
          where: {
            id: expect.any(String),
          },
          data: {
            type: "PROFESSIONAL",
          },
        });

        expect(
          professionalProfileCreate,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      "ignores an event when Profile is already ahead of the target",
      async () => {
        const userId =
          crypto.randomUUID();

        const {
          prisma,
          accountUpdate,
        } =
          createPrismaMock({
            id:
              crypto.randomUUID(),
            userId,
            type: "PROFESSIONAL",
            talentProfile: null,
            professionalProfile:
              {},
          });

        const useCase =
          new HandleAccountTypeChangedUseCase(
            prisma,
          );

        const event =
          createEvent({
            userId,
            previousAccountType:
              "USER",
            newAccountType:
              "TALENT",
          });

        const result =
          await useCase.execute(
            event,
          );

        expect(result).toEqual({
          processed: false,
          outcome:
            "IGNORED_STALE",
        });

        expect(
          accountUpdate,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "ignores duplicate delivery",
      async () => {
        const userId =
          crypto.randomUUID();

        const {
          prisma,
          processedEventCreateMany,
          accountUpdate,
        } =
          createPrismaMock({
            id:
              crypto.randomUUID(),
            userId,
            type: "USER",
            talentProfile: null,
            professionalProfile:
              null,
          });

        processedEventCreateMany.mockResolvedValueOnce(
          {
            count: 0,
          },
        );

        const useCase =
          new HandleAccountTypeChangedUseCase(
            prisma,
          );

        const event =
          createEvent({
            userId,
            previousAccountType:
              "USER",
            newAccountType:
              "TALENT",
          });

        const result =
          await useCase.execute(
            event,
          );

        expect(result).toEqual({
          processed: false,
          outcome:
            "IGNORED_STALE",
        });

        expect(
          accountUpdate,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "rejects a downgrade event",
      async () => {
        const userId =
          crypto.randomUUID();

        const {
          prisma,
        } =
          createPrismaMock({
            id:
              crypto.randomUUID(),
            userId,
            type: "PROFESSIONAL",
            talentProfile: null,
            professionalProfile:
              {},
          });

        const useCase =
          new HandleAccountTypeChangedUseCase(
            prisma,
          );

        const event =
          createEvent({
            userId,
            previousAccountType:
              "PROFESSIONAL",
            newAccountType:
              "TALENT",
          });

        await expect(
          useCase.execute(event),
        ).rejects.toThrow(
          "Invalid account type transition: PROFESSIONAL -> TALENT",
        );
      },
    );
  },
);