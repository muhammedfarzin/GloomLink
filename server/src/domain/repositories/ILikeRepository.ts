import { Like } from "../entities/Like";

export type LikeableType = "post";

export interface ILikeRepository {
  findByTargetAndUser(
    targetId: string,
    userId: string,
    type: LikeableType
  ): Promise<Like | null>;
  create(likeData: {
    targetId: string;
    userId: string;
    type: LikeableType;
  }): Promise<Like>;
  delete(id: string): Promise<void>;
}
