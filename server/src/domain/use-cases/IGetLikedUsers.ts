import { LikeableType } from "../repositories/ILikeRepository";
import { UserListViewDto } from "../../application/dtos/UserDto";

export interface IGetLikedUsers {
  execute(input: GetLikedUsersInput): Promise<UserListViewDto[]>;
}

export interface GetLikedUsersInput {
  targetId: string;
  userId?: string;
  type: LikeableType;
  page: number;
  limit: number;
}
