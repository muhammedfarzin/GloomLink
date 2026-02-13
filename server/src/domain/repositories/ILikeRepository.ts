import type { Like } from "../entities/Like";
import { UserCompactProfile } from "../models/UserCompactProfile";

export type LikeableType = "post";
export interface LikeOptions {
  userId?: string;
  type: LikeableType;
  page: number;
  limit: number;
}

export interface ILikeRepository {
  findByTargetAndUser(
    targetId: string,
    userId: string,
    type: LikeableType,
  ): Promise<Like | null>;
  create(likeData: {
    targetId: string;
    userId: string;
    type: LikeableType;
  }): Promise<Like>;
  delete(id: string): Promise<void>;
  findLikersByTarget(
    targetId: string,
    options: LikeOptions,
  ): Promise<UserCompactProfile[]>;
}
