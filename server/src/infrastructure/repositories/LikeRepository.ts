import type { Model, PipelineStage } from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "@/shared/types";
import mongoose from "mongoose";
import type { UserCompact } from "@/domain/models/User";
import type {
  ILikeRepository,
  LikeOptions,
} from "@/domain/repositories/ILikeRepository";
import { Like } from "@/domain/entities/Like";
import { LikeMapper } from "../mappers/LikeMapper";
import type { LikeDocument } from "../database/models/LikeModel";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class LikeRepository
  extends BaseRepository<Like, LikeDocument>
  implements ILikeRepository
{
  constructor(
    @inject(TYPES.LikeModel) protected readonly model: Model<LikeDocument>,
    @inject(TYPES.LikeMapper) protected readonly mapper: LikeMapper,
  ) {
    super();
  }

  async find(like: Like): Promise<Like | null> {
    const { id, ...likeToFind } = this.mapper.toPersistence(like);
    const likeModel = await this.model.findOne(likeToFind);
    return likeModel ? this.mapper.toDomain(likeModel) : null;
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

    const result = await this.model.aggregate(aggregationPipeline);
    return result;
  }
}
