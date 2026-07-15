import type { LikeableType } from "../repositories/ILikeRepository";
import type { UserCompact } from "../models/User";

export interface IGetLikedUsers {
  execute(input: GetLikedUsersInput): Promise<UserCompact[]>;
}

export interface GetLikedUsersInput {
  targetId: string;
  userId?: string;
  type: LikeableType;
  page: number;
  limit: number;
}
