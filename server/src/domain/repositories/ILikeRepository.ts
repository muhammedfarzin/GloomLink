import type { UserListViewDto } from "../../application/dtos/UserDto";
import type { Like } from "../entities/Like";

export type LikeableType = "post";
export interface LikeOptions {
  userId?: string;
  type: LikeableType;
  page: number;
  limit: number;
}

export interface ILikeRepository {
  create(like: Like): Promise<Like>;
  find(like: Like): Promise<Like | null>;
  delete(id: string): Promise<void>;
  findLikersByTarget(
    targetId: string,
    options: LikeOptions,
  ): Promise<UserListViewDto[]>;
}
