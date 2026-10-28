import type { UserActivityType } from "../models/UserActivity";
import type { UserCompact } from "../models/User";

export interface IGetLikedUsers {
  execute(input: GetLikedUsersInput): Promise<UserCompact[]>;
}

export interface GetLikedUsersInput {
  targetId: string;
  userId?: string;
  type: UserActivityType["targetType"];
  page: number;
  limit: number;
}
