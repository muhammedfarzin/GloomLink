import { injectable } from "inversify";
import mongoose, { type PipelineStage } from "mongoose";
import type { Follow } from "../../domain/entities/Follow";
import type { UserListView } from "../../domain/models/User";
import type {
  FollowListOptions,
  FollowListType,
  IFollowRepository,
} from "../../domain/repositories/IFollowRepository";
import { FollowModel } from "../database/models/FollowModel";
import { FollowMapper } from "../mappers/FollowMapper";

@injectable()
export class FollowRepository implements IFollowRepository {
  async create(follow: Follow): Promise<Follow> {
    const { id, ...followToPersist } = FollowMapper.toPersistence(follow);
    const newFollow = new FollowModel(followToPersist);
    const savedDoc = await newFollow.save();
    return FollowMapper.toDomain(savedDoc);
  }

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
  ): Promise<UserListView[]> {
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
          type: "user",
          userId: `$${lookupAs}._id`,
          username: `$${lookupAs}.username`,
          fullname: {
            $concat: [`$${lookupAs}.firstname`, " ", `$${lookupAs}.lastname`],
          },
          firstname: `$${lookupAs}.firstname`,
          lastname: `$${lookupAs}.lastname`,
          imageUrl: `$${lookupAs}.imageUrl`,
          isFollowing: `$${lookupAs}.isFollowing`,
        },
      },
    ];

    const result = await FollowModel.aggregate(aggregationPipeline);
    return result;
  }

  async deleteById(id: string): Promise<void> {
    await FollowModel.findByIdAndDelete(id);
  }
}
