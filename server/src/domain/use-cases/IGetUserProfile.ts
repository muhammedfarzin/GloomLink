import type { UserProfile } from "../models/User";

export interface IGetUserProfile {
  execute(input: GetUserProfileInput): Promise<UserProfile>;
}

export interface GetUserProfileInput {
  username: string;
  currentUserId: string;
  limit?: number;
}
