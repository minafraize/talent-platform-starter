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