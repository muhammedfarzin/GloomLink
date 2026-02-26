import type { FollowListType } from "../repositories/IFollowRepository";
import type { UserListView } from "../models/User";

export interface IGetFollowList {
  execute(input: GetFollowListInput): Promise<UserListView[]>;
}

export interface GetFollowListInput {
  userId: string;
  currentUserId?: string;
  type: FollowListType;
  page: number;
  limit: number;
}
