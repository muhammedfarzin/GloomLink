import { FollowListType } from "../repositories/IFollowRepository";
import { UserListViewDto } from "../../application/dtos/UserDto";

export interface IGetFollowList {
  execute(input: GetFollowListInput): Promise<UserListViewDto[]>;
}

export interface GetFollowListInput {
  userId: string;
  currentUserId?: string;
  type: FollowListType;
  page: number;
  limit: number;
}
