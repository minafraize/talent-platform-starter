import type {
  Profile,
  ProfileRepository,
} from "../ports/profile-repository.js";

export interface CreateProfileInput {
  userId: string;
}

export class CreateProfileUseCase {
  constructor(
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(
    input: CreateProfileInput,
  ): Promise<Profile> {
    return this.profileRepository.createForUser(
      input.userId,
    );
  }
}