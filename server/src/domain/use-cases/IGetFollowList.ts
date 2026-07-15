import type { FollowListType } from "../repositories/IFollowRepository";
import type { UserCompact } from "../models/User";

export interface IGetFollowList {
  execute(input: GetFollowListInput): Promise<UserCompact[]>;
}

export interface GetFollowListInput {
  userId: string;
  currentUserId?: string;
  type: FollowListType;
  page: number;
  limit: number;
}
