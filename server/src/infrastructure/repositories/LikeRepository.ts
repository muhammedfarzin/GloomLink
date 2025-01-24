import { Types } from "mongoose";
import { type Like, LikeModel } from "../database/models/LikeModel";

class LikeRepository {
  async createLike(
    targetId: string,
    userId: string,
    type: Like["type"] = "post"
  ) {
    const existLike = await LikeModel.findOne({ targetId, userId, type });

    if (existLike) return;

    const like = new LikeModel({
      targetId,
      userId,
      type,
    });

    await like.save();
  }

  async checkIsLiked(userId: string, targetId: string) {
    const like = await LikeModel.findOne({ userId, targetId });
    return !!like;
  }

  async removeLike(
    targetId: string,
    userId: string,
    type: Like["type"] = "post"
  ) {
    await LikeModel.findOneAndDelete({
      targetId,
      userId,
      type,
    });
  }
}

export const likeRepository = new LikeRepository();
