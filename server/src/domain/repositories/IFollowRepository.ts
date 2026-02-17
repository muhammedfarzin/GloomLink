import type { UserListViewDto } from "../../application/dtos/UserDto";
import type { Follow } from "../entities/Follow";

export type FollowListType = "followers" | "following";
export interface FollowListOptions {
  currentUserId?: string;
  page: number;
  limit: number;
}

export interface IFollowRepository {
  create(followerId: string, followingId: string): Promise<Follow>;
  findByUsers(followerId: string, followingId: string): Promise<Follow | null>;
  findFollowing(userId: string): Promise<Follow[]>;
  findFollowList(
    userId: string,
    type: FollowListType,
    options: FollowListOptions,
  ): Promise<UserListViewDto[]>;
  deleteById(id: string): Promise<void>;
}
