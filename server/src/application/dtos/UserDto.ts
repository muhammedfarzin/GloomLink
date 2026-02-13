import type { Post } from "../../domain/entities/Post";
import { UserCompactProfile } from "../../domain/models/UserCompactProfile";

type AuthType = "email" | "google";
type UserStatus = "active" | "inactive" | "blocked" | "not-verified";

export interface UserWithStatusDto extends UserCompactProfile {
  status: UserStatus;
}

export interface UserWithAuthDto extends UserCompactProfile {
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
  type?: "user";
}

export interface UserDto extends UserWithAuthDto {
  email: string;
  passwordHash: string;
  status: UserStatus;
  blockedUsers: string[] | undefined;
  savedPosts: string[] | undefined;
  interestKeywords: string[] | undefined;
}
