import {
  CreateProfileUseCase,
} from "./use-cases/create-profile.js";

import {
  UpdateProfileUseCase,
} from "./use-cases/update-profile.js";

import {
  PrismaProfileRepository,
} from "../infrastructure/database/prisma-profile-repository.js";

const profileRepository =
  new PrismaProfileRepository();

export const container = {
  profileRepository,

  createProfile:
    new CreateProfileUseCase(
      profileRepository,
    ),

  updateProfile:
    new UpdateProfileUseCase(
      profileRepository,
    ),
};