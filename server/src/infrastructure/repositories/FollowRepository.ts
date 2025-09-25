import {
  FollowListType,
  IFollowRepository,
} from "../../domain/repositories/IFollowRepository";
import { Follow } from "../../domain/entities/Follow";
import { FollowModel } from "../database/models/FollowModel";
import { FollowMapper } from "../database/mappers/FollowMapper";
import { UserListResponseDto } from "../../application/dtos/UserListResponseDto";
import mongoose, { PipelineStage } from "mongoose";
import { UserMapper } from "../database/mappers/UserMapper";

export class FollowRepository implements IFollowRepository {
  async create(followerId: string, followingId: string): Promise<Follow> {
    const newFollow = new FollowModel({
      followedBy: followerId,
      followingTo: followingId,
    });
    const savedDoc = await newFollow.save();
    return FollowMapper.toDomain(savedDoc);
  }

  async findByUsers(
    followerId: string,
    followingId: string
  ): Promise<Follow | null> {
    const followDoc = await FollowModel.findOne({
      followedBy: followerId,
      followingTo: followingId,
    });
    return followDoc ? FollowMapper.toDomain(followDoc) : null;
  }

  async findFollowing(userId: string): Promise<Follow[]> {
    const followModels = await FollowModel.find({ followedBy: userId });
    return followModels.map(FollowMapper.toDomain);
  }

  async findFollowList(
    userId: string,
    type: FollowListType,
    options: { page: number; limit: number }
  ): Promise<UserListResponseDto[]> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    // ---Conditionally set the fields for our query based on the type---
    const matchField = type === "followers" ? "followingTo" : "followedBy";
    const lookupLocalField =
      type === "followers" ? "followedBy" : "followingTo";
    const lookupAs = type === "followers" ? "followerInfo" : "followingInfo";

    const aggregationPipeline: PipelineStage[] = [
      { $match: { [matchField]: new mongoose.Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: lookupLocalField,
          foreignField: "_id",
          as: lookupAs,
        },
      },
      { $unwind: `$${lookupAs}` },
      {
        $project: {
          _id: `$${lookupAs}._id`,
          username: `$${lookupAs}.username`,
          firstname: `$${lookupAs}.firstname`,
          lastname: `$${lookupAs}.lastname`,
          image: `$${lookupAs}.image`,
        },
      },
    ];

    const results = await FollowModel.aggregate(aggregationPipeline);
    return results.map(UserMapper.toListView);
  }

  async deleteById(id: string): Promise<void> {
    await FollowModel.findByIdAndDelete(id);
  }
}
