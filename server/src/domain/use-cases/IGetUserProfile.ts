import { UserProfileResponseDto } from "../../application/dtos/UserDto";

export interface IGetUserProfile {
  execute(input: GetUserProfileInput): Promise<UserProfileResponseDto>;
}

export interface GetUserProfileInput {
  username: string;
  currentUserId: string;
  limit?: number;
}
