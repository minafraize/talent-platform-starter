import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  UpdateProfileUseCase,
} from "../../src/application/use-cases/update-profile.js";

describe("UpdateProfileUseCase", () => {
  it("updates profile data", async () => {
    const repository = {
      findByUserId: vi.fn().mockResolvedValue({
        id: "profile-1",
        accountId: "account-1",
        userId: "user-1",
        type: "TALENT",
        status: "ACTIVE",

        username: null,
        displayName: null,
        bio: null,
        avatarMediaId: null,
        countryCode: null,
        city: null,

        createdAt: new Date(),
        updatedAt: new Date(),
      }),

      createForUser: vi.fn(),

      updateByUserId: vi.fn().mockResolvedValue({
        id: "profile-1",
        accountId: "account-1",
        userId: "user-1",
        type: "TALENT",
        status: "ACTIVE",

        username: "mina_fraiz",
        displayName: "Mina Fraiz",
        bio: "Frontend Developer",
        avatarMediaId: null,
        countryCode: "EG",
        city: "Cairo",

        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    };

    const useCase =
      new UpdateProfileUseCase(
        repository,
      );

    const result =
      await useCase.execute({
        userId: "user-1",

        username:
          "MINA_FRAIZ",

        displayName:
          "Mina Fraiz",

        bio:
          "Frontend Developer",

        countryCode:
          "eg",

        city:
          "Cairo",
      });

    expect(
      repository.findByUserId,
    ).toHaveBeenCalledWith(
      "user-1",
    );

    expect(
      repository.updateByUserId,
    ).toHaveBeenCalledWith(
      "user-1",
      {
        username: "mina_fraiz",
        displayName: "Mina Fraiz",
        bio: "Frontend Developer",
        countryCode: "EG",
        city: "Cairo",
      },
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: "profile-1",
        userId: "user-1",
        username: "mina_fraiz",
        displayName: "Mina Fraiz",
        bio: "Frontend Developer",
        countryCode: "EG",
        city: "Cairo",
      }),
    );
  });

  it("returns PROFILE_NOT_FOUND when profile does not exist", async () => {
    const repository = {
      findByUserId:
        vi.fn().mockResolvedValue(
          null,
        ),

      createForUser: vi.fn(),

      updateByUserId:
        vi.fn(),
    };

    const useCase =
      new UpdateProfileUseCase(
        repository,
      );

    await expect(
      useCase.execute({
        userId: "unknown-user",
        displayName: "Mina",
      }),
    ).rejects.toMatchObject({
      code: "PROFILE_NOT_FOUND",
    });

    expect(
      repository.updateByUserId,
    ).not.toHaveBeenCalled();
  });

  it("normalizes username", async () => {
    const repository = {
      findByUserId:
        vi.fn().mockResolvedValue({
          id: "profile-1",
          accountId: "account-1",
          userId: "user-1",
          type: "TALENT",
          status: "ACTIVE",

          username: null,
          displayName: null,
          bio: null,
          avatarMediaId: null,
          countryCode: null,
          city: null,

          createdAt: new Date(),
          updatedAt: new Date(),
        }),

      createForUser: vi.fn(),

      updateByUserId:
        vi.fn().mockResolvedValue({
          id: "profile-1",
          accountId: "account-1",
          userId: "user-1",
          type: "TALENT",
          status: "ACTIVE",

          username: "mina_fraiz",
          displayName: null,
          bio: null,
          avatarMediaId: null,
          countryCode: null,
          city: null,

          createdAt: new Date(),
          updatedAt: new Date(),
        }),
    };

    const useCase =
      new UpdateProfileUseCase(
        repository,
      );

    await useCase.execute({
      userId: "user-1",
      username:
        "  MINA_FRAIZ  ",
    });

    expect(
      repository.updateByUserId,
    ).toHaveBeenCalledWith(
      "user-1",
      {
        username: "mina_fraiz",
      },
    );
  });
});