import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserProfileResponseDto } from "../dtos/UserProfileResponseDto";
import { HttpError } from "../../infrastructure/errors/HttpError";

export interface GetUserProfileInput {
  username: string;
  currentUserId: string;
  limit?: number;
}

export class GetUserProfile {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: GetUserProfileInput): Promise<UserProfileResponseDto> {
    const userProfile = await this.userRepository.findProfileByUsername(
      input.username,
      input.currentUserId,
      input.limit
    );

    if (!userProfile) {
      throw new HttpError(404, "User profile not found or has been removed");
    }

    return userProfile;
  }
}
