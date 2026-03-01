import { injectable, inject } from "inversify";
import { UserNotFoundError } from "../../domain/errors/NotFoundErrors";
import { TYPES } from "../../shared/types";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { UserProfile } from "../../domain/models/User";
import type {
  IGetUserProfile,
  GetUserProfileInput,
} from "../../domain/use-cases/IGetUserProfile";

@injectable()
export class GetUserProfile implements IGetUserProfile {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(input: GetUserProfileInput): Promise<UserProfile> {
    const userProfile = await this.userRepository.findProfileByUsername(
      input.username,
      input.currentUserId,
      input.limit,
    );

    if (!userProfile) {
      throw new UserNotFoundError();
    }

    return userProfile;
  }
}
