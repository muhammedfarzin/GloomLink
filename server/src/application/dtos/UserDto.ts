import type { Post } from "../../domain/entities/Post";

type AuthType = "email" | "google";
type UserStatus = "active" | "inactive" | "blocked" | "not-verified";

export interface UserBasicDto {
  userId: string;
  username: string;
  fullname: string;
  firstname: string;
  lastname?: string;
  email: string;
  mobile?: string;
  imageUrl?: string;
  dob?: Date;
  gender?: "f" | "m";
}

export interface UserWithStatusDto extends UserBasicDto {
  status: UserStatus;
}

export interface UserWithAuthDto extends UserBasicDto {
  authType: AuthType;
}

export interface UserProfileResponseDto extends UserBasicDto {
  posts: Omit<Post, "tags">[];
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export interface UserListViewDto extends UserBasicDto {
  isFollowing?: boolean;
  type: "user";
}

export interface UserDto extends UserWithAuthDto {
  passwordHash: string;
  status: UserStatus;
  blockedUsers?: string[] | undefined;
  savedPosts?: string[] | undefined;
  interestKeywords?: string[] | undefined;
}
