import type { LikeableType } from "../repositories/ILikeRepository";
import type { UserListView } from "../models/User";

export interface IGetLikedUsers {
  execute(input: GetLikedUsersInput): Promise<UserListView[]>;
}

export interface GetLikedUsersInput {
  targetId: string;
  userId?: string;
  type: LikeableType;
  page: number;
  limit: number;
}
