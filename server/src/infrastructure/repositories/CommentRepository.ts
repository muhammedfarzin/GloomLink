import { isObjectIdOrHexString, Types } from "mongoose";
import {
  CommentModel,
  type CommentType,
} from "../database/models/CommentModel";
import { HttpError } from "../errors/HttpError";

class CommentRepository {
  async getComments(
    targetId: string,
    type: CommentType["type"],
    userId: string,
    forMe: true
  ): Promise<any[]>;
  async getComments(
    targetId: string,
    type: CommentType["type"],
    userId?: string,
    forMe?: false
  ): Promise<any[]>;
  async getComments(
    targetId: string,
    type: CommentType["type"] = "post",
    userId?: string,
    forMe: boolean = false
  ) {
    if (!isObjectIdOrHexString(targetId))
      throw new HttpError(400, `Invalid ${type}`);

    const comments = await CommentModel.aggregate([
      {
        $match: {
          targetId: Types.ObjectId.createFromHexString(targetId),
          type,
          userId: forMe
            ? { $eq: userId && Types.ObjectId.createFromHexString(userId) }
            : { $ne: userId && Types.ObjectId.createFromHexString(userId) },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "uploadedBy",
          pipeline: [
            {
              $project: {
                username: 1,
                firstname: 1,
                lastname: 1,
                image: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$uploadedBy" },
    ]);

    return comments;
  }

  async addComment(
    targetId: string,
    userId: string,
    comment: string,
    type: CommentType["type"]
  ) {
    const newComment = new CommentModel({ targetId, userId, comment, type });
    const resComment = await newComment.save();

    return resComment.toObject();
  }

  async getCount(postId: string) {
    if (!isObjectIdOrHexString(postId))
      throw new HttpError(400, "Invalid post");

    const count = await CommentModel.countDocuments({
      targetId: Types.ObjectId.createFromHexString(postId),
    });

    return count;
  }
}

export const commentRepository = new CommentRepository();
