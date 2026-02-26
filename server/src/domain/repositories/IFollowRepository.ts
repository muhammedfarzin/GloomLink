import type { UserListView } from "../models/User";
import type { Follow } from "../entities/Follow";

export type FollowListType = "followers" | "following";
export interface FollowListOptions {
  currentUserId?: string;
  page: number;
  limit: number;
}

export interface IFollowRepository {
  create(follow: Follow): Promise<Follow>;
  find(followerId: string, followingId: string): Promise<Follow | null>;
  findFollowing(userId: string): Promise<Follow[]>;
  findFollowList(
    userId: string,
    type: FollowListType,
    options: FollowListOptions,
  ): Promise<UserListView[]>;
  deleteById(id: string): Promise<void>;
}
