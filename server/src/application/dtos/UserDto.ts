import type { Post } from "../../domain/entities/Post";
import { UserCompactProfile } from "../../domain/models/UserCompactProfile";

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

export interface UserProfileResponseDto extends UserCompactProfile {
  posts: Omit<Post, "tags">[];
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export interface UserListViewDto extends UserCompactProfile {
  isFollowing?: boolean;
  type: "user";
}

export interface UserDto extends UserWithAuthDto {
  email: string;
  passwordHash: string;
  status: UserStatus;
  blockedUsers: string[] | undefined;
  savedPosts: string[] | undefined;
  interestKeywords: string[] | undefined;
}
