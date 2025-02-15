import { isObjectIdOrHexString, Types } from "mongoose";
import { type Like, LikeModel } from "../database/models/LikeModel";
import { HttpError } from "../errors/HttpError";
import { postRepository } from "./PostRepository";
import { userRepository } from "./UserRepository";

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

    if (type === "post") {
      const post = await postRepository.findById(targetId);
      if (post)
        await userRepository.addInterestedKeywords(userId, post.tags.join(" "));
    }
  }

  async getCount(postId: string) {
    if (!isObjectIdOrHexString(postId))
      throw new HttpError(400, "Invalid post");

    const count = await LikeModel.countDocuments({
      targetId: Types.ObjectId.createFromHexString(postId),
    });

    return count;
  }

  async checkIsLiked(userId: string, targetId: string) {
    const like = await LikeModel.findOne({ userId, targetId });
    return !!like;
  }

  async getLikedUsers(targetId: string, type: Like["type"] = "post") {
    const users = await LikeModel.aggregate([
      {
        $match: {
          targetId: Types.ObjectId.createFromHexString(targetId),
          type,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
          pipeline: [
            {
              $project: {
                _id: 1,
                firstname: 1,
                lastname: 1,
                username: 1,
                image: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$userData" },
      { $replaceRoot: { newRoot: "$userData" } },
    ]);

    return users;
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
