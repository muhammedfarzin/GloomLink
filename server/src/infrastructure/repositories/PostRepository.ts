import type { Model, PipelineStage } from "mongoose";
import mongoose from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "@/shared/types";
import { PostMapper } from "../mappers/PostMapper";
import { type PostDocument } from "../database/models/PostModel";
import { Post } from "@/domain/entities/Post";
import type {
  IPostRepository,
  PostDashboardMetrics,
  PostFeedOptions,
} from "@/domain/repositories/IPostRepository";
import type { EnrichedPost } from "@/domain/models/Post";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class PostRepository
  extends BaseRepository<Post, PostDocument>
  implements IPostRepository
{
  constructor(
    @inject(TYPES.PostModel) protected readonly model: Model<PostDocument>,
    @inject(TYPES.PostMapper) protected readonly mapper: PostMapper,
  ) {
    super();
  }
  private enrichedPipeline: PipelineStage[] = [
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
    // ---Populate the author details---
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
        likesCount: { $size: "$likes" },
        commentsCount: { $size: "$comments" },
      },
    },
  ];

  async findEnrichedById(
    postId: string,
    userId: string,
  ): Promise<EnrichedPost | null> {
    const currentUserId = new mongoose.Types.ObjectId(userId);
    const postObjectId = new mongoose.Types.ObjectId(postId);

    const aggregationPipeline = [
      { $match: { _id: postObjectId, status: "active" } },
      ...this.enrichedPipeline,
      {
        $lookup: {
          from: "user-activities",
          let: { currentUserId: currentUserId, postId: "$_id" },
          pipeline: [
            {
              $match: {
                action: "save",
                targetType: "post",
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$currentUserId"] },
                    { $eq: ["$targetId", "$$postId"] },
                  ],
                },
              },
            },
          ],
          as: "savedPostsActivity",
        },
      },
      {
        $addFields: {
          postId: "$_id",
          isLiked: { $in: [currentUserId, "$likes.userId"] },
          isSaved: { $gt: [{ $size: "$savedPostsActivity" }, 0] },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          userId: 1,
          caption: 1,
          images: 1,
          tags: 1,
          publishedFor: 1,
          status: 1,
          likesCount: 1,
          commentsCount: 1,
          isLiked: 1,
          isSaved: 1,
          uploadedBy: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const results = await this.model.aggregate(aggregationPipeline);

    if (results.length === 0) {
      return null;
    }

    return this.mapper.toResponse(results[0]);
  }

  async findAndSortFeed(options: PostFeedOptions): Promise<EnrichedPost[]> {
    const {
      userId,
      authorId,
      searchQuery = "",
      sort = "relevant",
      followingUserIds = [],
      interestKeywords = [],
      page,
      limit,
    } = options;
    const skip = (page - 1) * limit;
    let currentUserId: mongoose.Types.ObjectId | null = null;

    if (userId) {
      currentUserId = new mongoose.Types.ObjectId(userId);
    }

    const interestKeywordsRegex = interestKeywords.map(
      (keyword) => new RegExp(keyword, "i"),
    );

    const matchStage: PipelineStage.Match = {
      $match: {
        status: "active",
        ...(authorId && { userId: new mongoose.Types.ObjectId(authorId) }),
        $or: [
          { caption: { $regex: searchQuery, $options: "i" } },
          { tags: searchQuery.toLowerCase().split(" ") },
        ],
      },
    };

    const excludeReportedPostPipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "reports",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$targetId", "$$postId"] },
                    { $eq: ["$reportedBy", currentUserId] },
                    { $eq: ["$type", "post"] },
                  ],
                },
              },
            },
          ],
          as: "userReport",
        },
      },
      { $match: { userReport: { $size: 0 } } },
    ];

    const addRelevaceScoreStage: PipelineStage.AddFields = {
      $addFields: {
        relevanceScore: {
          $sum: [
            { $size: { $setIntersection: ["$tags", interestKeywords] } },
            { $cond: [{ $in: ["$caption", interestKeywordsRegex] }, 1, 0] },
            {
              $cond: [
                {
                  $in: [
                    "$userId",
                    followingUserIds.map(
                      (id) => new mongoose.Types.ObjectId(id),
                    ),
                  ],
                },
                1,
                0,
              ],
            },
            { $cond: [{ $eq: ["$userId", currentUserId] }, -5, 0] },
          ],
        },
      },
    };

    const sortStage: PipelineStage.Sort = {
      $sort:
        sort === "relevant"
          ? { relevanceScore: -1, createdAt: -1 }
          : sort === "latest"
            ? { createdAt: -1 }
            : { createdAt: 1 },
    };

    const currentUserPipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "user-activities",
          let: { currentUserId: currentUserId, postId: "$_id" },
          pipeline: [
            {
              $match: {
                action: "save",
                targetType: "post",
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$currentUserId"] },
                    { $eq: ["$targetId", "$$postId"] },
                  ],
                },
              },
            },
          ],
          as: "savedPostsActivity",
        },
      },
      {
        $addFields: {
          id: "$_id",
          isLiked: { $in: [currentUserId, "$likes.userId"] },
          isSaved: { $gt: [{ $size: "$savedPostsActivity" }, 0] },
        },
      },
    ];

    const aggregationPipeline: PipelineStage[] = [
      matchStage,
      ...(currentUserId ? excludeReportedPostPipeline : []),
      addRelevaceScoreStage,
      sortStage,
      { $skip: skip },
      { $limit: limit },
      ...this.enrichedPipeline,
      ...(currentUserId ? currentUserPipeline : []),
      {
        $project: {
          _id: 0,
          likes: 0,
          comments: 0,
          relevanceScore: 0,
          savedPostsActivity: 0,
          userReport: 0,
        },
      },
    ];

    const postModels = await this.model.aggregate(aggregationPipeline);

    return postModels.map((data) => this.mapper.toResponse(data));
  }

  async findAll(options: {
    page: number;
    limit: number;
    searchQuery: string;
    withReports?: boolean;
  }): Promise<EnrichedPost[]> {
    const { page, limit, searchQuery = "" } = options;
    const skip = (page - 1) * limit;

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: {
          status: { $ne: "deleted" },
          $or: [
            { caption: { $regex: searchQuery, $options: "i" } },
            { tags: searchQuery.toLowerCase().split(" ") },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      ...this.enrichedPipeline,
      { $addFields: { id: "$_id" } },
      {
        $project: {
          _id: 0,
          likes: 0,
          comments: 0,
        },
      },
    ];

    if (options.withReports) {
      aggregationPipeline.push(
        {
          $lookup: {
            from: "reports",
            localField: "id",
            foreignField: "targetId",
            as: "reports",
          },
        },
        {
          $addFields: {
            reportCount: { $size: "$reports" },
          },
        },
        { $project: { reports: 0 } },
      );
    }

    const results = await this.model.aggregate(aggregationPipeline);
    return results.map((item) => this.mapper.toResponse(item));
  }

  async findByStatus(
    status: "active" | "blocked",
    options: {
      page: number;
      limit: number;
      searchQuery: string;
      withReports?: boolean;
    },
  ): Promise<EnrichedPost[]> {
    const { page, limit, searchQuery = "" } = options;
    const skip = (page - 1) * limit;

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: {
          status,
          $or: [
            { caption: { $regex: searchQuery, $options: "i" } },
            { tags: searchQuery.toLowerCase().split(" ") },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      ...this.enrichedPipeline,
      { $addFields: { postId: "$_id" } },
      { $project: { _id: 0, likes: 0, comments: 0 } },
    ];

    if (options.withReports) {
      aggregationPipeline.push(
        {
          $lookup: {
            from: "reports",
            localField: "_id",
            foreignField: "targetId",
            as: "reports",
          },
        },
        {
          $addFields: {
            reportCount: { $size: "$reports" },
          },
        },
        { $project: { reports: 0 } },
      );
    }

    const results = await this.model.aggregate(aggregationPipeline);
    return results.map((item) => this.mapper.toResponse(item));
  }

  async findReported(options: {
    page: number;
    limit: number;
    searchQuery?: string;
  }): Promise<EnrichedPost[]> {
    const { page, limit, searchQuery = "" } = options;
    const skip = (page - 1) * limit;

    const aggregationPipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "reports",
          localField: "_id",
          foreignField: "targetId",
          as: "reports",
        },
      },
      {
        $addFields: {
          postId: "$_id",
          reportCount: { $size: "$reports" },
        },
      },
      {
        $match: {
          reportCount: { $gt: 0 },
          status: { $ne: "deleted" },
          $or: [
            { caption: { $regex: searchQuery, $options: "i" } },
            { tags: searchQuery.toLowerCase().split(" ") },
          ],
        },
      },
      { $sort: { reportCount: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      ...this.enrichedPipeline,
      { $project: { _id: 0, reports: 0, likes: 0, comments: 0 } },
    ];

    const results = await this.model.aggregate(aggregationPipeline);
    return results.map((item) => this.mapper.toResponse(item));
  }

  async update(post: Post): Promise<Post | null> {
    const { id, createdAt, updatedAt, ...postToPersist } =
      this.mapper.toPersistence(post);
    const updatedPost = await this.model.findByIdAndUpdate(id, postToPersist, {
      new: true,
    });
    return updatedPost && this.mapper.toDomain(updatedPost);
  }

  async deleteById(postId: string): Promise<Post | null> {
    const deletedPost = await this.model.findByIdAndUpdate(
      postId,
      { status: "deleted" },
      { new: true },
    );

    return deletedPost && this.mapper.toDomain(deletedPost);
  }

  async getDashboardMetrics(
    startDate: Date,
    endDate: Date,
  ): Promise<PostDashboardMetrics> {
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

    const totalPosts = await this.model.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    const postsAgg = await this.model.aggregate([
      matchDateRange,
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    const chartData = postsAgg.map((d) => ({
      date: d._id,
      count: d.count,
    }));

    return { totalPosts, chartData };
  }
}
