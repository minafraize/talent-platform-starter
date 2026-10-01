import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { CreateProfileUseCase } from "../../src/application/use-cases/create-profile.js";

describe("CreateProfileUseCase", () => {
  it("creates a profile for a user", async () => {
    const profile = {
      id: "profile-1",
      userId: "user-1",
      type: null,
      displayName: null,
      username: null,
      bio: null,
      avatarMediaId: null,
      countryCode: null,
      city: null,
      onboardingCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const repository = {
      findByUserId: vi.fn(),
      createForUser: vi
        .fn()
        .mockResolvedValue(profile),
    };

    const useCase =
      new CreateProfileUseCase(repository);

    const result = await useCase.execute({
      userId: "user-1",
    });

    expect(
      repository.createForUser,
    ).toHaveBeenCalledWith("user-1");

    expect(result).toEqual(profile);
  });
});