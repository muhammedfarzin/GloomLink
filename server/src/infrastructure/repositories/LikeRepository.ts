import { injectable } from "inversify";
import {
  ILikeRepository,
  LikeableType,
  LikeOptions,
} from "../../domain/repositories/ILikeRepository";
import { Like } from "../../domain/entities/Like";
import { LikeModel } from "../database/models/LikeModel";
import { LikeMapper } from "../mappers/LikeMapper";
import { UserListViewDto } from "../../application/dtos/UserDto";
import mongoose, { PipelineStage } from "mongoose";
import { UserMapper } from "../mappers/UserMapper";
import { UserCompactProfile } from "../../domain/models/UserCompactProfile";

@injectable()
export class LikeRepository implements ILikeRepository {
  async findByTargetAndUser(
    targetId: string,
    userId: string,
    type: LikeableType,
  ): Promise<Like | null> {
    const likeModel = await LikeModel.findOne({ targetId, userId, type });
    return likeModel ? LikeMapper.toDomain(likeModel) : null;
  }

  async create(likeData: {
    targetId: string;
    userId: string;
    type: LikeableType;
  }): Promise<Like> {
    const likeToPersist = LikeMapper.toPersistence(likeData);
    const newLikeModel = new LikeModel(likeToPersist);
    const savedLike = await newLikeModel.save();
    return LikeMapper.toDomain(savedLike);
  }

  async delete(id: string): Promise<void> {
    await LikeModel.findByIdAndDelete(id);
  }

  async findLikersByTarget(
    targetId: string,
    options: LikeOptions,
  ): Promise<UserCompactProfile[]> {
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
          userId: "$likerInfo._id",
          username: "$likerInfo.username",
          fullname: {
            $concat: [`$likerInfo.firstname`, " ", `$likerInfo.lastname`],
          },
          firstname: "$likerInfo.firstname",
          lastname: "$likerInfo.lastname",
          imageUrl: "$likerInfo.image",
          isFollowing: "$likerInfo.isFollowing",
        },
      },
    ];

    const result = await LikeModel.aggregate(aggregationPipeline);
    return result;
  }
}
