import {
  EnrichedPost,
  IPostRepository,
} from "../../domain/repositories/IPostRepository";
import { Post } from "../../domain/entities/Post";
import { PostMapper } from "../database/mappers/PostMapper";
import { PostModel } from "../database/models/PostModel";
import mongoose, { PipelineStage } from "mongoose";

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
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "uploadedBy",
        pipeline: [
          { $project: { username: 1, firstname: 1, lastname: 1, image: 1 } },
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

  async create(postData: Partial<Post>): Promise<Post> {
    const postToPersist = PostMapper.toPersistence(postData);
    const newPostModel = new PostModel(postToPersist);
    const savedPost = await newPostModel.save();
    return PostMapper.toDomain(savedPost);
  }

  async findById(id: string): Promise<Post | null> {
    const postModel = await PostModel.findById(id);
    return postModel ? PostMapper.toDomain(postModel) : null;
  }

  async findEnrichedById(
    postId: string,
    userId: string
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
          isLiked: { $in: [currentUserId, "$likes.userId"] },
          isSaved: { $in: [postObjectId, "$currentUserInfo.savedPosts"] },
        },
      },
      { $project: { likes: 0, comments: 0 } },
    ];

    const results = await PostModel.aggregate(aggregationPipeline);

    if (results.length === 0) {
      return null;
    }

    return PostMapper.toResponse(results[0]);
  }

  async findAndSortFeed(options: {
    userId: string;
    searchQuery?: string;
    interestKeywords: string[];
    followingUserIds: string[];
    page: number;
    limit: number;
  }): Promise<EnrichedPost[]> {
    const { interestKeywords, searchQuery = "", page, limit } = options;
    const skip = (page - 1) * limit;
    const currentUserId = new mongoose.Types.ObjectId(options.userId);

    const interestKeywordsRegex = interestKeywords.map(
      (keyword) => new RegExp(keyword, "i")
    );

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: {
          status: "active",
          $or: [
            { caption: { $regex: searchQuery, $options: "i" } },
            { tags: searchQuery.toLowerCase().split(" ") },
          ],
        },
      },

      // ---Excluding current user reported post---
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

      // ---Add a 'relevanceScore' field to each document---
      {
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
                      options.followingUserIds.map(
                        (id) => new mongoose.Types.ObjectId(id)
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
      },

      // ---Sort by the new relevanceScore and then by creation date---
      { $sort: { relevanceScore: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

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
                username: 1,
                image: 1,
                firstname: 1,
                lastname: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$uploadedBy" },
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
          isLiked: { $in: [currentUserId, "$likes.userId"] },
          isSaved: { $in: ["$_id", "$currentUserInfo.savedPosts"] },
          commentsCount: { $size: "$comments" },
          likesCount: { $size: "$likes" },
        },
      },
      {
        $project: {
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
      { $project: { likes: 0, comments: 0 } },
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
        { $project: { reports: 0 } }
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
    }
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
      { $project: { likes: 0, comments: 0 } },
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
        { $project: { reports: 0 } }
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
      { $project: { reports: 0, likes: 0, comments: 0 } },
    ];

    const results = await PostModel.aggregate(aggregationPipeline);
    return results.map(PostMapper.toResponse);
  }

  async update(postId: string, postData: Partial<Post>): Promise<Post | null> {
    const postToPersist = PostMapper.toPersistence(postData);
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      postToPersist,
      { new: true }
    );
    return updatedPost ? PostMapper.toDomain(updatedPost) : null;
  }

  async deleteById(postId: string): Promise<void> {
    await PostModel.findByIdAndUpdate(postId, { status: "deleted" });
  }
}
