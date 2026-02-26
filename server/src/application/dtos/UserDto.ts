import type { UserCompactProfile } from "../../domain/models/User";

type AuthType = "email" | "google";
type UserStatus = "active" | "inactive" | "blocked" | "not-verified";

export interface UserBasicDto extends UserCompactProfile {
  email?: string;
  mobile?: string;
  dob?: Date;
  gender?: "f" | "m";
}

export interface UserWithStatusDto extends UserBasicDto {
  status: UserStatus;
}

export interface UserWithAuthDto extends UserBasicDto {
  authType: AuthType;
}

export interface UserDto extends UserWithAuthDto {
  email: string;
  passwordHash: string;
  status: UserStatus;
  blockedUsers: string[] | undefined;
  savedPosts: string[] | undefined;
  interestKeywords: string[] | undefined;
}
