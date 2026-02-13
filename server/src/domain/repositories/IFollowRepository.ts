import { Follow } from "../entities/Follow";
import { UserCompactProfile } from "../models/UserCompactProfile";

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
  ): Promise<UserCompactProfile[]>;
  deleteById(id: string): Promise<void>;
}
