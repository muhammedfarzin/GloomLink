import {
  ILikeRepository,
  LikeableType,
} from "../../domain/repositories/ILikeRepository";
import { Like } from "../../domain/entities/Like";
import { LikeModel } from "../database/models/LikeModel";
import { LikeMapper } from "../database/mappers/LikeMapper";
import { UserListResponseDto } from "../../application/dtos/UserListResponseDto";
import mongoose, { PipelineStage } from "mongoose";
import { UserMapper } from "../database/mappers/UserMapper";

export class LikeRepository implements ILikeRepository {
  async findByTargetAndUser(
    targetId: string,
    userId: string,
    type: LikeableType
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
    options: {
      userId?: string;
      type: LikeableType;
      page: number;
      limit: number;
    }
  ): Promise<UserListResponseDto[]> {
    const { userId, type, page, limit } = options;
    const skip = (page - 1) * limit;

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: {
          targetId: new mongoose.Types.ObjectId(targetId),
          userId: { $ne: userId && new mongoose.Types.ObjectId(userId) },
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
        },
      },
      { $unwind: "$likerInfo" },
      {
        $project: {
          _id: "$likerInfo._id",
          username: "$likerInfo.username",
          firstname: "$likerInfo.firstname",
          lastname: "$likerInfo.lastname",
          image: "$likerInfo.image",
        },
      },
    ];

    const results = await LikeModel.aggregate(aggregationPipeline);

    return results.map(UserMapper.toListView);
  }
}
