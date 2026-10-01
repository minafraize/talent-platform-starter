export type ProfileAccountType =
  | "USER"
  | "TALENT"
  | "PROFESSIONAL";

export type ProfileAccountStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "DEACTIVATED";

export interface Profile {
  id: string;
  accountId: string;
  userId: string;
  type: ProfileAccountType;
  status: ProfileAccountStatus;

  displayName: string | null;
  username: string | null;
  bio: string | null;
  avatarMediaId: string | null;
  countryCode: string | null;
  city: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileData {
  username?: string;
  displayName?: string;
  bio?: string;
  countryCode?: string;
  city?: string;
  avatarMediaId?: string;
}

export interface ProfileRepository {
  findByUserId(
    userId: string,
  ): Promise<Profile | null>;

  createForUser(
    userId: string,
  ): Promise<Profile>;

  updateByUserId(
    userId: string,
    data: UpdateProfileData,
  ): Promise<Profile>;
}