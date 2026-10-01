import {
  AppErrors,
  ErrorCode,
} from "@talent/errors";

import {
  isUniqueConstraintError,
} from "../../infrastructure/database/prisma-error.js";

import type {
  ProfileRepository,
} from "../ports/profile-repository.js";

export interface UpdateProfileInput {
  userId: string;

  username?: string;
  displayName?: string;
  bio?: string;
  countryCode?: string;
  city?: string;
  avatarMediaId?: string;
}

export interface UpdateProfileOutput {
  id: string;
  userId: string;

  username: string | null;
  displayName: string | null;
  bio: string | null;
  countryCode: string | null;
  city: string | null;
  avatarMediaId: string | null;

  updatedAt: Date;
}

export class UpdateProfileUseCase {
  constructor(
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(
    input: UpdateProfileInput,
  ): Promise<UpdateProfileOutput> {
    const profile =
      await this.profileRepository.findByUserId(
        input.userId,
      );

    if (!profile) {
      throw AppErrors.notFound(
        ErrorCode.PROFILE_NOT_FOUND,
        "Profile was not found",
      );
    }

    if (profile.status !== "ACTIVE") {
      throw AppErrors.conflict(
        ErrorCode.PROFILE_NOT_ACTIVE,
        "Profile is not active",
      );
    }

    const data: {
      username?: string;
      displayName?: string;
      bio?: string;
      countryCode?: string;
      city?: string;
      avatarMediaId?: string;
    } = {};

    if (input.username !== undefined) {
      data.username =
        normalizeUsername(
          input.username,
        );
    }

    if (
      input.displayName !== undefined
    ) {
      data.displayName =
        normalizeOptionalText(
          input.displayName,
        );
    }

    if (input.bio !== undefined) {
      data.bio =
        normalizeOptionalText(
          input.bio,
        );
    }

    if (
      input.countryCode !== undefined
    ) {
      data.countryCode =
        input.countryCode
          .trim()
          .toUpperCase();
    }

    if (input.city !== undefined) {
      data.city =
        normalizeOptionalText(
          input.city,
        );
    }

    if (
      input.avatarMediaId !== undefined
    ) {
      data.avatarMediaId =
        input.avatarMediaId.trim();
    }

    if (
      Object.keys(data).length === 0
    ) {
      throw AppErrors.validation(
        ErrorCode.PROFILE_UPDATE_EMPTY,
        "At least one profile field is required",
      );
    }

    try {
      const updatedProfile =
        await this.profileRepository.updateByUserId(
          input.userId,
          data,
        );

      return {
        id: updatedProfile.id,
        userId: updatedProfile.userId,

        username:
          updatedProfile.username,

        displayName:
          updatedProfile.displayName,

        bio:
          updatedProfile.bio,

        countryCode:
          updatedProfile.countryCode,

        city:
          updatedProfile.city,

        avatarMediaId:
          updatedProfile.avatarMediaId,

        updatedAt:
          updatedProfile.updatedAt,
      };
    } catch (error) {
      if (
        isUniqueConstraintError(error)
      ) {
        throw AppErrors.conflict(
          ErrorCode.USERNAME_ALREADY_EXISTS,
          "Username is already in use",
        );
      }

      throw error;
    }
  }
}

function normalizeUsername(
  username: string,
): string {
  return username
    .trim()
    .toLowerCase();
}

function normalizeOptionalText(
  value: string,
): string {
  return value.trim();
}