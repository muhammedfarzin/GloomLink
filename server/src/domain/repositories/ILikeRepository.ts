import type { UserCompact } from "../models/User";
import type { Like } from "../entities/Like";
import type { IRepository } from "./IRepository";

export type LikeableType = "post";
export interface LikeOptions {
  userId?: string;
  type: LikeableType;
  page: number;
  limit: number;
}

export interface ILikeRepository extends IRepository {
  create(like: Like): Promise<Like>;
  find(like: Like): Promise<Like | null>;
  findById(id: string): Promise<Like | null>;
  findLikersByTarget(
    targetId: string,
    options: LikeOptions,
  ): Promise<UserCompact[]>;
  update(data: Like): Promise<Like | null>;
  deleteById(id: string): Promise<Like | null>;
}
