import {
  prisma,
} from "./prisma.js";

import type {
  ProfileRepository,
  Profile,
  UpdateProfileData,
  ProfileAccountType,
  ProfileAccountStatus,
} from "../../application/ports/profile-repository.js";

function mapProfile(
  profile: {
    id: string;
    accountId: string;
    username: string | null;
    displayName: string | null;
    bio: string | null;
    avatarMediaId: string | null;
    countryCode: string | null;
    city: string | null;
    createdAt: Date;
    updatedAt: Date;
    account: {
      userId: string;
      type: ProfileAccountType;
      status: ProfileAccountStatus;
    };
  },
): Profile {
  return {
    id: profile.id,
    accountId: profile.accountId,
    userId: profile.account.userId,
    type: profile.account.type,
    status: profile.account.status,

    username: profile.username,
    displayName: profile.displayName,
    bio: profile.bio,
    avatarMediaId: profile.avatarMediaId,
    countryCode: profile.countryCode,
    city: profile.city,

    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

export class PrismaProfileRepository
  implements ProfileRepository
{
  async findByUserId(
    userId: string,
  ): Promise<Profile | null> {
    const profile =
      await prisma.profile.findFirst({
        where: {
          account: {
            userId,
          },
        },
        include: {
          account: {
            select: {
              userId: true,
              type: true,
              status: true,
            },
          },
        },
      });

    if (!profile) {
      return null;
    }

    return mapProfile(profile);
  }

  async createForUser(
    userId: string,
  ): Promise<Profile> {
    const account =
      await prisma.account.findUnique({
        where: {
          userId,
        },
      });

    if (!account) {
      throw new Error(
        "ACCOUNT_NOT_FOUND",
      );
    }

    const profile =
      await prisma.profile.create({
        data: {
          accountId: account.id,
        },
        include: {
          account: {
            select: {
              userId: true,
              type: true,
              status: true,
            },
          },
        },
      });

    return mapProfile(profile);
  }

  async updateByUserId(
    userId: string,
    data: UpdateProfileData,
  ): Promise<Profile> {
    const profile =
      await prisma.profile.findFirst({
        where: {
          account: {
            userId,
          },
        },
        select: {
          accountId: true,
        },
      });

    if (!profile) {
      throw new Error(
        "PROFILE_NOT_FOUND",
      );
    }

    const updatedProfile =
      await prisma.profile.update({
        where: {
          accountId: profile.accountId,
        },

        data,

        include: {
          account: {
            select: {
              userId: true,
              type: true,
              status: true,
            },
          },
        },
      });

    return mapProfile(updatedProfile);
  }
}