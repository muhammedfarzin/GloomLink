import type { UserActivityType } from "@/domain/models/UserActivity";
import type { UserCompact } from "@/domain/models/User";
import type { EnrichedPost } from "@/domain/models/Post";
import { PostMapper } from "../mappers/PostMapper";
import mongoose, { type Model, type PipelineStage } from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "@/shared/types";
import { UserActivity } from "@/domain/entities/UserActivity";
import type { UserActivityDocument } from "../database/models/UserActivityModel";
import { UserActivityMapper } from "../mappers/UserActivityMapper";
import type {
  IUserActivityRepository,
  UserActivityUsersOptions,
  UserActivityDashboardMetrics,
} from "@/domain/repositories/IUserActivityRepository";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class UserActivityRepository
  extends BaseRepository<UserActivity, UserActivityDocument>
  implements IUserActivityRepository
{
  constructor(
    @inject(TYPES.UserActivityModel)
    protected readonly model: Model<UserActivityDocument>,
    @inject(TYPES.UserActivityMapper)
    protected readonly mapper: UserActivityMapper,
    @inject(TYPES.PostMapper) private readonly postMapper: PostMapper,
  ) {
    super();
  }

  async hasActivity(
    userId: string,
    targetId: string,
    targetType: UserActivityType["targetType"],
    action: UserActivityType["action"],
  ): Promise<boolean> {
    return !!(await this.model.exists({
      userId,
      targetId,
      targetType,
      action,
    }));
  }

  async isLiked(
    userId: string,
    targetId: string,
    targetType: UserActivityType["targetType"],
  ): Promise<boolean> {
    return this.hasActivity(userId, targetId, targetType, "like");
  }

  // Returns whether the target is liked after the toggle.
  async toggleLike(
    userId: string,
    targetId: string,
    targetType: UserActivityType["targetType"],
  ): Promise<boolean> {
    const filter = { userId, targetId, targetType, action: "like" } as const;
    const result = await this.model.deleteOne(filter);
    if (result.deletedCount > 0) return false;

    const activity = this.mapper.toDomain({
      ...filter,
      id: "",
      metadata: {},
      createdAt: new Date(),
    });
    this.create(activity);
    return true;
  }

  async getUsersByTarget(
    targetId: string,
    options: UserActivityUsersOptions,
  ): Promise<UserCompact[]> {
    const { userId, targetType, action, page, limit } = options;
    const skip = (page - 1) * limit;

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: {
          targetId: new mongoose.Types.ObjectId(targetId),
          targetType,
          action,
        },
      },
      { $sort: { createdAt: -1, _id: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
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
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 0,
          id: { $toString: "$userInfo._id" },
          username: "$userInfo.username",
          fullname: {
            $concat: [`$userInfo.firstname`, " ", `$userInfo.lastname`],
          },
          firstname: "$userInfo.firstname",
          lastname: "$userInfo.lastname",
          imageUrl: "$userInfo.imageUrl",
          status: "$userInfo.status",
          isFollowing: "$userInfo.isFollowing",
          type: "user",
        },
      },
    ];

    const result = await this.model.aggregate(aggregationPipeline);
    return result;
  }

  async getSavedPosts(
    userId: string,
    page: number,
    limit: number,
  ): Promise<EnrichedPost[]> {
    const skip = (page - 1) * limit;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const aggregationPipeline: PipelineStage[] = [
      { $match: { userId: userObjectId, action: "save", targetType: "post" } },
      { $sort: { createdAt: -1, _id: -1 } },
      {
        $lookup: {
          from: "posts",
          localField: "targetId",
          foreignField: "_id",
          as: "savedPostsData",
          pipeline: [
            { $match: { status: "active" } },
            {
              $lookup: {
                from: "user-activities",
                pipeline: [{ $match: { action: "like", targetType: "post" } }],
                localField: "_id",
                foreignField: "targetId",
                as: "likes",
              },
            },
            {
              $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "targetId",
                as: "comments",
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
                      _id: 0,
                      id: "$_id",
                      username: 1,
                      firstname: 1,
                      lastname: 1,
                      imageUrl: 1,
                    },
                  },
                ],
              },
            },
            { $unwind: "$uploadedBy" },
            {
              $addFields: {
                isSaved: true,
              },
            },
            {
              $project: {
                _id: 0,
                id: { $toString: "$_id" },
                userId: 1,
                caption: 1,
                images: 1,
                tags: 1,
                publishedFor: 1,
                status: 1,
                likesCount: { $size: "$likes" },
                commentsCount: { $size: "$comments" },
                isLiked: { $in: [userObjectId, "$likes.userId"] },
                isSaved: 1,
                uploadedBy: 1,
                createdAt: 1,
                updatedAt: 1,
                type: "post",
              },
            },
          ],
        },
      },
      { $unwind: "$savedPostsData" },
      { $skip: skip },
      { $limit: limit },
      { $replaceRoot: { newRoot: "$savedPostsData" } },
    ];

    const results = await this.model.aggregate(aggregationPipeline);
    return results.map((post: any) => this.postMapper.toResponse(post));
  }

  async isPostSaved(userId: string, postId: string): Promise<boolean> {
    return this.hasActivity(userId, postId, "post", "save");
  }

  // Returns whether the post is saved after the toggle.
  async toggleSavePost(userId: string, postId: string): Promise<boolean> {
    const filter = {
      userId,
      targetId: postId,
      targetType: "post",
      action: "save",
    } as const;
    const result = await this.model.deleteOne(filter);
    if (result.deletedCount > 0) return false;

    const activity = this.mapper.toDomain({
      ...filter,
      id: "",
      metadata: {},
      createdAt: new Date(),
    });
    await this.create(activity);
    return true;
  }

  async create(interaction: UserActivity): Promise<UserActivity> {
    const { id, ...interactionToPersist } =
      this.mapper.toPersistence(interaction);

    const { userId, targetId, targetType, action } = interactionToPersist;
    const savedUserActivity = await this.model.findOneAndUpdate(
      { userId, targetId, targetType, action },
      action === "view"
        ? { $set: interactionToPersist }
        : { $setOnInsert: interactionToPersist },
      { upsert: true, new: true, runValidators: true },
    );
    if (action === "view") {
      const overflow = await this.model
        .find({ userId, action: "view" })
        .sort({ createdAt: -1, _id: -1 })
        .skip(100)
        .select("_id");
      if (overflow.length) {
        await this.model.deleteMany({
          _id: { $in: overflow.map((doc) => doc._id) },
        });
      }
    }

    return this.mapper.toDomain(savedUserActivity);
  }

  async findByUserId(
    userId: string,
    limit: number = 100,
  ): Promise<UserActivity[]> {
    const interactions = await this.model
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    return interactions.map((item) => this.mapper.toDomain(item));
  }

  async getTopInteractedTags(
    userId: string,
    limit: number = 10,
  ): Promise<string[]> {
    const result = await this.model.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          targetType: "post",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "targetId",
          foreignField: "_id",
          as: "post",
        },
      },
      { $unwind: "$post" },
      { $unwind: "$post.tags" },
      {
        $group: {
          _id: { $toLower: "$post.tags" },
          totalWeight: {
            $sum: {
              $switch: {
                branches: [
                  { case: { $eq: ["$action", "save"] }, then: 7 },
                  { case: { $eq: ["$action", "like"] }, then: 3 },
                ],
                default: 1,
              },
            },
          },
        },
      },
      { $sort: { totalWeight: -1 } },
      { $limit: limit },
      { $project: { _id: 0, tag: "$_id" } },
    ]);

    return result.map((r) => r.tag);
  }

  async getDashboardMetrics(
    startDate: Date,
    endDate: Date,
  ): Promise<UserActivityDashboardMetrics> {
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

    const totalInteractions = await this.model.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    const activeUsersAggregation = await this.model.aggregate([
      matchDateRange,
      { $group: { _id: "$userId" } },
      { $count: "activeUsers" },
    ]);
    const activeUsers =
      activeUsersAggregation.length > 0
        ? activeUsersAggregation[0].activeUsers
        : 0;

    const interactionsAgg = await this.model.aggregate([
      matchDateRange,
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    const chartData = interactionsAgg.map((d) => ({
      date: d._id,
      count: d.count,
    }));

    return { totalInteractions, activeUsers, chartData };
  }

  async update(data: UserActivity): Promise<UserActivity | null> {
    const {
      id,
      createdAt: _createdAt,
      ...interactionToPersist
    } = this.mapper.toPersistence(data);

    const interaction = await this.model.findByIdAndUpdate(
      id,
      interactionToPersist,
      { new: true },
    );

    return interaction && this.mapper.toDomain(interaction);
  }
}
