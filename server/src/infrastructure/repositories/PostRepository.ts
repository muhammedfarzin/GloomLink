import mongoose, { type PipelineStage } from "mongoose";
import { injectable } from "inversify";
import { PostMapper } from "../mappers/PostMapper";
import { type PostDocument, PostModel } from "../database/models/PostModel";
import { Post } from "@/domain/entities/Post";
import type {
  IPostRepository,
  PostDashboardMetrics,
  PostFeedOptions,
} from "@/domain/repositories/IPostRepository";
import type { EnrichedPost, PostType } from "@/domain/models/Post";

@injectable()
export class PostRepository implements IPostRepository {
  private enrichedPipeline: PipelineStage[] = [
    {
      $lookup: {
        from: "likes",
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

  async create(post: Post): Promise<Post> {
    const { createdAt, updatedAt, ...postToPersist } =
      PostMapper.toPersistence(post);
    const newPostModel = new PostModel(postToPersist);
    const savedPost = await newPostModel.save();
    return PostMapper.toDomain(this.safeParsePostDoc(savedPost));
  }

  async findById(id: string): Promise<Post | null> {
    const postModel = await PostModel.findById(id);
    return postModel
      ? PostMapper.toDomain(this.safeParsePostDoc(postModel))
      : null;
  }

  async findByIds(ids: string[]): Promise<Post[]> {
    const postModels = await PostModel.find({ _id: { $in: ids } });
    return postModels.map((post) =>
      PostMapper.toDomain(this.safeParsePostDoc(post)),
    );
  }

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
          from: "users",
          let: { currentUserId: currentUserId },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$currentUserId"] } } },
            { $project: { savedPosts: 1 } },
          ],
          as: "currentUserInfo",
        },
      },
      { $unwind: "$currentUserInfo" },
      {
        $addFields: {
          postId: "$_id",
          isLiked: { $in: [currentUserId, "$likes.userId"] },
          isSaved: { $in: [postObjectId, "$currentUserInfo.savedPosts"] },
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

    const results = await PostModel.aggregate(aggregationPipeline);

    if (results.length === 0) {
      return null;
    }

    return PostMapper.toResponse(results[0]);
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
          from: "users",
          let: { currentUserId: currentUserId },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$currentUserId"] } } },
            { $project: { savedPosts: 1 } },
          ],
          as: "currentUserInfo",
        },
      },
      { $unwind: "$currentUserInfo" },
      {
        $addFields: {
          id: "$_id",
          isLiked: { $in: [currentUserId, "$likes.userId"] },
          isSaved: { $in: ["$_id", "$currentUserInfo.savedPosts"] },
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
          currentUserInfo: 0,
          userReport: 0,
        },
      },
    ];

    const postModels = await PostModel.aggregate(aggregationPipeline);

    return postModels.map((data) => PostMapper.toResponse(data));
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

    const results = await PostModel.aggregate(aggregationPipeline);
    return results.map(PostMapper.toResponse);
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

    const results = await PostModel.aggregate(aggregationPipeline);
    return results.map(PostMapper.toResponse);
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

    const results = await PostModel.aggregate(aggregationPipeline);
    return results.map(PostMapper.toResponse);
  }

  async update(postId: string, post: Post): Promise<Post | null> {
    const { createdAt, updatedAt, ...postToPersist } =
      PostMapper.toPersistence(post);
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      postToPersist,
      { new: true },
    );
    return updatedPost
      ? PostMapper.toDomain(this.safeParsePostDoc(updatedPost))
      : null;
  }

  async deleteById(postId: string): Promise<void> {
    await PostModel.findByIdAndUpdate(postId, { status: "deleted" });
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

    const totalPosts = await PostModel.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    const postsAgg = await PostModel.aggregate([
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

  private safeParsePostDoc(postDoc: PostDocument): PostType {
    const { _id: postId, userId, ...postObj } = postDoc.toObject();

    return {
      ...postObj,
      postId: postId.toString(),
      userId: userId.toString(),
    };
  }
}
