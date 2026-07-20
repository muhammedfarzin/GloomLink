import type { UserCompact } from "../models/User";
import type { Follow } from "../entities/Follow";
import type { IRepository } from "./IRepository";

export type FollowListType = "followers" | "following";
export interface FollowListOptions {
  currentUserId?: string;
  page: number;
  limit: number;
}

export interface IFollowRepository extends IRepository {
  create(follow: Follow): Promise<Follow>;
  find(followerId: string, followingId: string): Promise<Follow | null>;
  findById(id: string): Promise<Follow | null>;
  findFollowing(userId: string): Promise<Follow[]>;
  findFollowList(
    userId: string,
    type: FollowListType,
    options: FollowListOptions,
  ): Promise<UserCompact[]>;
  update(data: Follow): Promise<Follow | null>;
  deleteById(id: string): Promise<Follow | null>;
}
