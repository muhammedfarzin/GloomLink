import { injectable } from "inversify";
import mongoose, { PipelineStage } from "mongoose";
import type { UserCompact } from "@/domain/models/User";
import type {
  ILikeRepository,
  LikeOptions,
} from "@/domain/repositories/ILikeRepository";
import { Like } from "@/domain/entities/Like";
import { LikeModel } from "../database/models/LikeModel";
import { LikeMapper } from "../mappers/LikeMapper";

@injectable()
export class LikeRepository implements ILikeRepository {
  async create(like: Like): Promise<Like> {
    const { id, ...likeToPersist } = LikeMapper.toPersistence(like);
    const newLikeModel = new LikeModel(likeToPersist);
    const savedLike = await newLikeModel.save();
    return LikeMapper.toDomain(savedLike);
  }

  async find(like: Like): Promise<Like | null> {
    const { id, ...likeToFind } = LikeMapper.toPersistence(like);
    const likeModel = await LikeModel.findOne(likeToFind);
    return likeModel ? LikeMapper.toDomain(likeModel) : null;
  }

  async findById(id: string): Promise<Like | null> {
    const likeDoc = await LikeModel.findById(id);
    return likeDoc && LikeMapper.toDomain(likeDoc);
  }

  async findLikersByTarget(
    targetId: string,
    options: LikeOptions,
  ): Promise<UserCompact[]> {
    const { userId, type, page, limit } = options;
    const skip = (page - 1) * limit;

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: {
          targetId: new mongoose.Types.ObjectId(targetId),
          type: type,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "likerInfo",
          pipeline: [
            {
              $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "followingTo",
                as: "followers",
              },
            },
            {
              $addFields: {
                isFollowing: userId
                  ? {
                      $in: [
                        new mongoose.Types.ObjectId(userId),
                        "$followers.followedBy",
                      ],
                    }
                  : undefined,
              },
            },
          ],
        },
      },
      { $unwind: "$likerInfo" },
      {
        $project: {
          _id: 0,
          id: { $toString: "$likerInfo._id" },
          username: "$likerInfo.username",
          fullname: {
            $concat: [`$likerInfo.firstname`, " ", `$likerInfo.lastname`],
          },
          firstname: "$likerInfo.firstname",
          lastname: "$likerInfo.lastname",
          imageUrl: "$likerInfo.imageUrl",
          status: "$likerInfo.status",
          isFollowing: "$likerInfo.isFollowing",
          type: "user",
        },
      },
    ];

    const result = await LikeModel.aggregate(aggregationPipeline);
    return result;
  }

  async update(data: Like): Promise<Like | null> {
    const { id, ...likeToUpdate } = LikeMapper.toPersistence(data);
    const updatedLike = await LikeModel.findByIdAndUpdate(id, likeToUpdate, {
      new: true,
    });
    return updatedLike && LikeMapper.toDomain(updatedLike);
  }

  async deleteById(id: string): Promise<Like | null> {
    const likeDoc = await LikeModel.findByIdAndDelete(id);
    return likeDoc && LikeMapper.toDomain(likeDoc);
  }
}
