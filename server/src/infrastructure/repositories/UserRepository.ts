import type { Model } from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "@/shared/types";
import mongoose, { type PipelineStage } from "mongoose";
import { UserMapper } from "../mappers/UserMapper";
import type { UserDocument } from "../database/models/UserModel";
import { User } from "@/domain/entities/User";
import {
  ActivityWeight,
  UserSuggestionWeight,
} from "@/domain/rules/RecommendationWeight";
import type { UserCompact, UserProfile } from "@/domain/models/User";
import type {
  IUserRepository,
  SuggestionInput,
  UserDashboardMetrics,
  UserFindOptions,
  UserIdentifier,
} from "@/domain/repositories/IUserRepository";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class UserRepository
  extends BaseRepository<User, UserDocument>
  implements IUserRepository
{
  constructor(
    @inject(TYPES.UserModel) protected readonly model: Model<UserDocument>,
    @inject(TYPES.UserMapper) protected readonly mapper: UserMapper,
  ) {
    super();
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.model.findOne({ email });
    if (!userDoc) return null;

    return this.mapper.toDomain(userDoc);
  }

  async findByUsername(username: string): Promise<User | null> {
    const userDoc = await this.model.findOne({ username });
    if (!userDoc) return null;

    return this.mapper.toDomain(userDoc);
  }

  async findByIdentifier(identifier: string): Promise<User | null> {
    const userDoc = await this.model.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { mobile: identifier },
      ],
    });

    if (!userDoc) return null;

    return this.mapper.toDomain(userDoc);
  }

  async checkUserExist(
    query: UserIdentifier,
  ): Promise<
    { isExists: false } | { isExists: true; data: User; field: string }
  > {
    const { username, email, mobile } = query;
    for (const [field, value] of Object.entries({ username, email, mobile })) {
      if (!value) continue;

      const userDoc = await this.model.findOne({ [field]: value });

      if (userDoc) {
        return {
          isExists: true,
          field,
          data: this.mapper.toDomain(userDoc),
        };
      }
    }

    return { isExists: false };
  }

  async update(userData: User): Promise<User | null> {
    const {
      id,
      email: _email,
      blockedUsers: _blockedUser,
      interestKeywords,
      ...userToPersist
    } = this.mapper.toPersistence(userData);

    const updatedUserDoc = await this.model.findByIdAndUpdate(
      id,
      { $set: userToPersist },
      { new: true },
    );

    if (!updatedUserDoc) return null;

    return this.mapper.toDomain(updatedUserDoc);
  }

  async findProfileByUsername(
    username: string,
    currentUserId: string,
    limit = 15,
  ): Promise<UserProfile | null> {
    const viewerId = currentUserId
      ? new mongoose.Types.ObjectId(currentUserId)
      : null;

    const aggregationPipeline: PipelineStage[] = [
      { $match: { username: username, status: "active" } },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followingTo",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followedBy",
          as: "following",
        },
      },
      {
        $addFields: {
          id: "$_id",
          followersCount: { $size: "$followers" },
          followingCount: { $size: "$following" },
          isFollowing: viewerId
            ? { $in: [viewerId, "$followers.followedBy"] }
            : undefined,
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          username: 1,
          firstname: 1,
          lastname: 1,
          fullname: 1,
          imageUrl: 1,
          followersCount: 1,
          followingCount: 1,
          isFollowing: 1,
          status: 1,
        },
      },
    ];

    const results = await this.model.aggregate(aggregationPipeline);

    if (results.length === 0) {
      return null;
    }

    const profileData = results[0];

    if (viewerId && viewerId.toString() === profileData.id.toString()) {
      delete profileData.isFollowing;
    }

    return this.mapper.toProfile(profileData);
  }

  async findAll(options: UserFindOptions): Promise<User[]> {
    const { filter = "all", searchQuery = "", page, limit } = options;
    const skip = (page - 1) * limit;

    const matchStage: PipelineStage.Match["$match"] = {
      $or: [
        { username: { $regex: searchQuery, $options: "i" } },
        { firstname: { $regex: searchQuery, $options: "i" } },
        { lastname: { $regex: searchQuery, $options: "i" } },
        ...(options.searchWithPersonalInfo
          ? [
              { email: { $regex: searchQuery, $options: "i" } },
              { mobile: { $regex: searchQuery, $options: "i" } },
            ]
          : []),
      ],
    };

    const isFollowingStage: PipelineStage[] = [
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followingTo",
          as: "followers",
          pipeline: [
            {
              $match: {
                followedBy: new mongoose.Types.ObjectId(options.currUserId),
              },
            },
          ],
        },
      },
      {
        $addFields: {
          isFollowing: { $gt: [{ $size: "$followers" }, 0] },
          fullname: {
            $concat: [`$firstname`, " ", `$lastname`],
          },
        },
      },
      {
        $project: { followers: 0 },
      },
    ];

    if (filter !== "all") {
      matchStage.status = filter;
    }

    const aggregationPipeline: PipelineStage[] = [
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $addFields: { id: "$_id" } },
    ];

    if (options.currUserId) {
      aggregationPipeline.push(...isFollowingStage);
    }

    const userList = await this.model.aggregate(aggregationPipeline);

    return userList.map((user) => {
      return this.mapper.toDomain({ ...user, userId: user._id.toString() });
    });
  }

  async findSuggestions(input: SuggestionInput): Promise<UserCompact[]> {
    if (input.limit <= 0) return [];

    const userObjectId = new mongoose.Types.ObjectId(input.userId);
    const excludeObjectIds = input.excludeIds.map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    // Use the same activity weights as the feed, alongside saved interests.
    const interestStages: Exclude<
      PipelineStage,
      PipelineStage.Merge | PipelineStage.Out
    >[] = [
      {
        $lookup: {
          from: "user-activities",
          localField: "_id",
          foreignField: "userId",
          pipeline: [
            { $match: { targetType: "post" } },
            {
              $lookup: {
                from: "posts",
                localField: "targetId",
                foreignField: "_id",
                as: "post",
              },
            },
            { $unwind: "$post" },
            { $match: { "post.status": "active" } },
            { $unwind: "$post.tags" },
            {
              $group: {
                _id: { $toLower: { $trim: { input: "$post.tags" } } },
                weight: {
                  $sum: {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: ["$action", "save"] },
                          then: ActivityWeight.Save,
                        },
                        {
                          case: { $eq: ["$action", "like"] },
                          then: ActivityWeight.Like,
                        },
                      ],
                      default: ActivityWeight.View,
                    },
                  },
                },
              },
            },
            { $sort: { weight: -1, _id: 1 } },
            { $limit: 20 },
          ],
          as: "activityInterests",
        },
      },
      {
        $set: {
          interests: {
            $setDifference: [
              {
                $setUnion: [
                  {
                    $map: {
                      input: { $ifNull: ["$interestKeywords", []] },
                      as: "keyword",
                      in: { $toLower: { $trim: { input: "$$keyword" } } },
                    },
                  },
                  "$activityInterests._id",
                ],
              },
              [""],
            ],
          },
        },
      },
    ];

    const aggregationPipeline: PipelineStage[] = [
      { $match: { _id: userObjectId, status: "active" } },
      ...interestStages,
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followedBy",
          as: "following",
        },
      },
      {
        $lookup: {
          from: "users",
          let: {
            followingIds: "$following.followingTo",
            viewerInterests: "$interests",
            blockedIds: { $ifNull: ["$blockedUsers", []] },
          },
          pipeline: [
            {
              $match: {
                _id: { $nin: [...excludeObjectIds, userObjectId] },
                status: "active",
                blockedUsers: { $ne: userObjectId },
                $expr: { $not: [{ $in: ["$_id", "$$blockedIds"] }] },
              },
            },
            ...interestStages,
            // candidate -> shared following <- viewer
            {
              $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "followedBy",
                pipeline: [
                  {
                    $match: {
                      $expr: { $in: ["$followingTo", "$$followingIds"] },
                    },
                  },
                ],
                as: "sharedFollowing",
              },
            },
            // viewer -> following -> candidate
            {
              $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "followingTo",
                pipeline: [
                  {
                    $match: {
                      $expr: { $in: ["$followedBy", "$$followingIds"] },
                    },
                  },
                ],
                as: "followedByFollowing",
              },
            },
            {
              $set: {
                sharedInterests: {
                  $size: {
                    $setIntersection: ["$interests", "$$viewerInterests"],
                  },
                },
                mutualConnections: {
                  $add: [
                    { $size: "$sharedFollowing" },
                    { $size: "$followedByFollowing" },
                  ],
                },
                isFollowing: { $in: ["$_id", "$$followingIds"] },
              },
            },
            // Existing follows remain relevant for starting a conversation.
            {
              $set: {
                relevance: {
                  $add: [
                    {
                      $multiply: [
                        "$sharedInterests",
                        UserSuggestionWeight.SharedInterest,
                      ],
                    },
                    {
                      $multiply: [
                        "$mutualConnections",
                        UserSuggestionWeight.MutualConnection,
                      ],
                    },
                    {
                      $cond: [
                        "$isFollowing",
                        UserSuggestionWeight.Following,
                        0,
                      ],
                    },
                  ],
                },
              },
            },
            { $match: { relevance: { $gt: 0 } } },
            {
              $sort: {
                relevance: -1,
                mutualConnections: -1,
                sharedInterests: -1,
                _id: 1,
              },
            },
            { $limit: input.limit },
            {
              $project: {
                _id: 0,
                id: { $toString: "$_id" },
                username: 1,
                fullname: { $concat: ["$firstname", " ", "$lastname"] },
                firstname: 1,
                lastname: 1,
                imageUrl: 1,
                status: 1,
                isFollowing: 1,
                type: { $literal: "user" },
              },
            },
          ],
          as: "suggestions",
        },
      },
      { $unwind: "$suggestions" },
      { $replaceRoot: { newRoot: "$suggestions" } },
    ];

    return this.model.aggregate<UserCompact>(aggregationPipeline);
  }

  async getDashboardMetrics(
    startDate: Date,
    endDate: Date,
  ): Promise<UserDashboardMetrics> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const matchDateRange = {
      $match: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    };

    const totalUsers = await this.model.countDocuments();
    const newUsers = await this.model.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    const newUsersAgg = await this.model.aggregate([
      matchDateRange,
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    const chartData = newUsersAgg.map((d) => ({
      date: d._id,
      count: d.count,
    }));

    return { totalUsers, newUsers, chartData };
  }

  async deleteById(id: string): Promise<User | null> {
    const deletedUserDoc = await this.model.findByIdAndUpdate(
      id,
      { $set: { status: "deleted" } },
      { new: true },
    );

    return deletedUserDoc && this.mapper.toDomain(deletedUserDoc);
  }
}
