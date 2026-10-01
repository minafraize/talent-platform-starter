import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  UpgradeAccountUseCase,
} from "../../../src/application/use-cases/upgrade-account.js";

describe(
  "UpgradeAccountUseCase",
  () => {
    it("upgrades USER -> TALENT and writes an outbox event", async () => {
      const userFindUnique =
        vi.fn().mockResolvedValue({
          id: "11111111-1111-1111-1111-111111111111",
          accountType: "USER",
        });

      const userUpdateMany =
        vi.fn().mockResolvedValue({
          count: 1,
        });

      const outboxCreate =
        vi.fn().mockResolvedValue({
          id: "22222222-2222-2222-2222-222222222222",
        });

      const tx = {
        user: {
          findUnique:
            userFindUnique,
          updateMany:
            userUpdateMany,
        },
        outboxEvent: {
          create:
            outboxCreate,
        },
      };

      const prisma = {
        $transaction: vi.fn(
          async (
            callback: (
              tx: typeof tx,
            ) => Promise<unknown>,
          ) => callback(tx),
        ),
      } as any;

      const useCase =
        new UpgradeAccountUseCase(
          prisma,
        );

      const result =
        await useCase.execute({
          userId:
            "11111111-1111-1111-1111-111111111111",
          targetAccountType:
            "TALENT",
        });

      expect(result).toEqual({
        userId:
          "11111111-1111-1111-1111-111111111111",
        previousAccountType:
          "USER",
        newAccountType:
          "TALENT",
      });

      expect(
        userUpdateMany,
      ).toHaveBeenCalledWith({
        where: {
          id: "11111111-1111-1111-1111-111111111111",
          accountType: "USER",
        },
        data: {
          accountType: "TALENT",
        },
      });

      expect(
        outboxCreate,
      ).toHaveBeenCalledWith({
        data: {
          eventId: expect.any(String),
          eventType:
            "identity.account.type.changed",
          aggregateType: "User",
          aggregateId:
            "11111111-1111-1111-1111-111111111111",
          payload: {
            userId:
              "11111111-1111-1111-1111-111111111111",
            previousAccountType:
              "USER",
            newAccountType:
              "TALENT",
          },
        },
      });
    });

    it("upgrades TALENT -> PROFESSIONAL", async () => {
      const tx = {
        user: {
          findUnique: vi.fn().mockResolvedValue({
            id: "11111111-1111-1111-1111-111111111111",
            accountType: "TALENT",
          }),

          updateMany: vi.fn().mockResolvedValue({
            count: 1,
          }),
        },

        outboxEvent: {
          create: vi.fn().mockResolvedValue({
            id: "22222222-2222-2222-2222-222222222222",
          }),
        },
      };

      const prisma = {
        $transaction: vi.fn(
          async (
            callback: (
              tx: typeof tx,
            ) => Promise<unknown>,
          ) => callback(tx),
        ),
      } as any;

      const useCase =
        new UpgradeAccountUseCase(
          prisma,
        );

      const result =
        await useCase.execute({
          userId:
            "11111111-1111-1111-1111-111111111111",
          targetAccountType:
            "PROFESSIONAL",
        });

      expect(result.newAccountType)
        .toBe("PROFESSIONAL");
    });

    it("rejects a forbidden transition", async () => {
      const userFindUnique =
        vi.fn().mockResolvedValue({
          id: "11111111-1111-1111-1111-111111111111",
          accountType: "PROFESSIONAL",
        });

      const userUpdateMany =
        vi.fn();

      const outboxCreate =
        vi.fn();

      const tx = {
        user: {
          findUnique:
            userFindUnique,
          updateMany:
            userUpdateMany,
        },
        outboxEvent: {
          create:
            outboxCreate,
        },
      };

      const prisma = {
        $transaction: vi.fn(
          async (
            callback: (
              tx: typeof tx,
            ) => Promise<unknown>,
          ) => callback(tx),
        ),
      } as any;

      const useCase =
        new UpgradeAccountUseCase(
          prisma,
        );

      await expect(
        useCase.execute({
          userId:
            "11111111-1111-1111-1111-111111111111",
          targetAccountType:
            "TALENT",
        }),
      ).rejects.toThrow(
        "Cannot upgrade account from PROFESSIONAL to TALENT",
      );

      expect(
        userUpdateMany,
      ).not.toHaveBeenCalled();

      expect(
        outboxCreate,
      ).not.toHaveBeenCalled();
    });

    it("rejects when the user does not exist", async () => {
      const tx = {
        user: {
          findUnique:
            vi.fn().mockResolvedValue(null),

          updateMany:
            vi.fn(),
        },

        outboxEvent: {
          create:
            vi.fn(),
        },
      };

      const prisma = {
        $transaction: vi.fn(
          async (
            callback: (
              tx: typeof tx,
            ) => Promise<unknown>,
          ) => callback(tx),
        ),
      } as any;

      const useCase =
        new UpgradeAccountUseCase(
          prisma,
        );

      await expect(
        useCase.execute({
          userId:
            "11111111-1111-1111-1111-111111111111",
          targetAccountType:
            "TALENT",
        }),
      ).rejects.toThrow(
        "User not found",
      );
    });

    it("rejects when another request changes the account type first", async () => {
      const tx = {
        user: {
          findUnique:
            vi.fn().mockResolvedValue({
              id: "11111111-1111-1111-1111-111111111111",
              accountType: "USER",
            }),

          updateMany:
            vi.fn().mockResolvedValue({
              count: 0,
            }),
        },

        outboxEvent: {
          create:
            vi.fn(),
        },
      };

      const prisma = {
        $transaction: vi.fn(
          async (
            callback: (
              tx: typeof tx,
            ) => Promise<unknown>,
          ) => callback(tx),
        ),
      } as any;

      const useCase =
        new UpgradeAccountUseCase(
          prisma,
        );

      await expect(
        useCase.execute({
          userId:
            "11111111-1111-1111-1111-111111111111",
          targetAccountType:
            "TALENT",
        }),
      ).rejects.toThrow(
        "Account type was changed by another request",
      );

      expect(
        tx.outboxEvent.create,
      ).not.toHaveBeenCalled();
    });
  },
);