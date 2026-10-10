import { injectable } from "inversify";
import mongoose, { type PipelineStage } from "mongoose";
import type { Follow } from "@/domain/entities/Follow";
import type { UserCompact } from "@/domain/models/User";
import type {
  FollowListOptions,
  FollowListType,
  IFollowRepository,
} from "@/domain/repositories/IFollowRepository";
import type { FollowDocument } from "../database/models/FollowModel";
import { FollowModel } from "../database/models/FollowModel";
import { FollowMapper } from "../mappers/FollowMapper";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class FollowRepository
  extends BaseRepository<Follow, FollowDocument>
  implements IFollowRepository
{
  protected readonly model = FollowModel;
  protected readonly mapper = FollowMapper;

  async find(followerId: string, followingId: string): Promise<Follow | null> {
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
    options: FollowListOptions,
  ): Promise<UserCompact[]> {
    const { currentUserId, page, limit } = options;
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
                isFollowing: currentUserId
                  ? {
                      $in: [
                        new mongoose.Types.ObjectId(currentUserId),
                        "$followers.followedBy",
                      ],
                    }
                  : undefined,
              },
            },
          ],
        },
      },
      { $unwind: `$${lookupAs}` },
      {
        $project: {
          _id: 0,
          id: { $toString: `$${lookupAs}._id` },
          username: `$${lookupAs}.username`,
          fullname: {
            $concat: [`$${lookupAs}.firstname`, " ", `$${lookupAs}.lastname`],
          },
          firstname: `$${lookupAs}.firstname`,
          lastname: `$${lookupAs}.lastname`,
          imageUrl: `$${lookupAs}.imageUrl`,
          status: `$${lookupAs}.status`,
          isFollowing: `$${lookupAs}.isFollowing`,
          type: "user",
        },
      },
    ];

    const result = await FollowModel.aggregate(aggregationPipeline);
    return result;
  }
}
