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
    it(
      "upgrades USER -> TALENT and writes an outbox event and audit event",
      async () => {
        const userFindUnique =
          vi.fn().mockResolvedValue({
            id:
              "11111111-1111-1111-1111-111111111111",

            status:
              "ACTIVE",

            accountType:
              "USER",
          });

        const userUpdateMany =
          vi.fn().mockResolvedValue({
            count: 1,
          });

        const outboxCreate =
          vi.fn().mockResolvedValue({
            id:
              "22222222-2222-2222-2222-222222222222",
          });

        const securityEventCreate =
          vi.fn().mockResolvedValue({
            id:
              "33333333-3333-3333-3333-333333333333",
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

          securityEvent: {
            create:
              securityEventCreate,
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
            id:
              "11111111-1111-1111-1111-111111111111",

            status:
              "ACTIVE",

            accountType:
              "USER",
          },

          data: {
            accountType:
              "TALENT",
          },
        });

        expect(
          outboxCreate,
        ).toHaveBeenCalledWith({
          data: {
            eventId:
              expect.any(String),

            eventType:
              "identity.account.type.changed",

            aggregateType:
              "User",

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

        expect(
          securityEventCreate,
        ).toHaveBeenCalledWith({
          data: {
            userId:
              "11111111-1111-1111-1111-111111111111",

            type:
              "ACCOUNT_TYPE_CHANGED",

            ipHash:
              undefined,

            userAgent:
              undefined,

            metadata: {
              previousAccountType:
                "USER",

              newAccountType:
                "TALENT",
            },
          },
        });
      },
    );

    it(
      "upgrades TALENT -> PROFESSIONAL",
      async () => {
        const tx = {
          user: {
            findUnique:
              vi.fn().mockResolvedValue({
                id:
                  "11111111-1111-1111-1111-111111111111",

                status:
                  "ACTIVE",

                accountType:
                  "TALENT",
              }),

            updateMany:
              vi.fn().mockResolvedValue({
                count: 1,
              }),
          },

          outboxEvent: {
            create:
              vi.fn().mockResolvedValue({
                id:
                  "22222222-2222-2222-2222-222222222222",
              }),
          },

          securityEvent: {
            create:
              vi.fn().mockResolvedValue({
                id:
                  "33333333-3333-3333-3333-333333333333",
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

        expect(
          result.newAccountType,
        ).toBe(
          "PROFESSIONAL",
        );
      },
    );

    it(
      "rejects a forbidden transition",
      async () => {
        const userFindUnique =
          vi.fn().mockResolvedValue({
            id:
              "11111111-1111-1111-1111-111111111111",

            status:
              "ACTIVE",

            accountType:
              "PROFESSIONAL",
          });

        const userUpdateMany =
          vi.fn();

        const outboxCreate =
          vi.fn();

        const securityEventCreate =
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

          securityEvent: {
            create:
              securityEventCreate,
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

        expect(
          securityEventCreate,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "rejects when the user does not exist",
      async () => {
        const tx = {
          user: {
            findUnique:
              vi.fn().mockResolvedValue(
                null,
              ),

            updateMany:
              vi.fn(),
          },

          outboxEvent: {
            create:
              vi.fn(),
          },

          securityEvent: {
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

        expect(
          tx.outboxEvent.create,
        ).not.toHaveBeenCalled();

        expect(
          tx.securityEvent.create,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "rejects when another request changes the account type first",
      async () => {
        const tx = {
          user: {
            findUnique:
              vi.fn().mockResolvedValue({
                id:
                  "11111111-1111-1111-1111-111111111111",

                status:
                  "ACTIVE",

                accountType:
                  "USER",
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

          securityEvent: {
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
          "Account state was changed by another request",
        );

        expect(
          tx.outboxEvent.create,
        ).not.toHaveBeenCalled();

        expect(
          tx.securityEvent.create,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "does not write audit or outbox events for an idempotent request",
      async () => {
        const outboxCreate =
          vi.fn();

        const securityEventCreate =
          vi.fn();

        const tx = {
          user: {
            findUnique:
              vi.fn().mockResolvedValue({
                id:
                  "11111111-1111-1111-1111-111111111111",

                status:
                  "ACTIVE",

                accountType:
                  "TALENT",
              }),

            updateMany:
              vi.fn(),
          },

          outboxEvent: {
            create:
              outboxCreate,
          },

          securityEvent: {
            create:
              securityEventCreate,
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
            "TALENT",

          newAccountType:
            "TALENT",
        });

        expect(
          outboxCreate,
        ).not.toHaveBeenCalled();

        expect(
          securityEventCreate,
        ).not.toHaveBeenCalled();
      },
    );
  },
);