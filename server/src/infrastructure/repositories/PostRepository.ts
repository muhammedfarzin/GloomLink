import {
  EnrichedPost,
  IPostRepository,
} from "../../domain/repositories/IPostRepository";
import { Post } from "../../domain/entities/Post";
import { PostMapper } from "../database/mappers/PostMapper";
import { PostModel } from "../database/models/PostModel";
import mongoose, { PipelineStage } from "mongoose";

export class PostRepository implements IPostRepository {
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
            {
              $project: {
                username: 1,
                firstname: 1,
                lastname: 1,
                image: 1,
                savedPosts: 1,
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
          isLiked: { $in: [currentUserId, "$likes.userId"] },
          isSaved: { $in: [postObjectId, "$uploadedBy.savedPosts"] },
        },
      },

      { $project: { likes: 0, comments: 0, "uploadedBy.savedPosts": 0 } },
    ];

    const results = await PostModel.aggregate(aggregationPipeline);

    if (results.length === 0) {
      return null;
    }

    return PostMapper.toResponse(results[0]);
  }

  async findAndSortFeed(options: {
    userId: string;
    interestKeywords: string[];
    followingUserIds: string[];
    page: number;
    limit: number;
  }): Promise<EnrichedPost[]> {
    const { userId, interestKeywords, followingUserIds, page, limit } = options;
    const skip = (page - 1) * limit;
    const currentUserId = new mongoose.Types.ObjectId(userId);

    const interestKeywordsRegex = interestKeywords.map(
      (keyword) => new RegExp(keyword, "i")
    );

    const aggregationPipeline: PipelineStage[] = [
      { $match: { status: "active" } },

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
                      followingUserIds.map(
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
                savedPosts: 1,
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
        $addFields: {
          isLiked: { $in: [currentUserId, "$likes.userId"] },
          isSaved: { $in: ["$_id", "$uploadedBy.savedPosts"] },
          commentsCount: { $size: "$comments" },
          likesCount: { $size: "$likes" },
        },
      },
      {
        $project: {
          likes: 0,
          comments: 0,
          relevanceScore: 0,
          "uploadedBy.savedPosts": 0,
        },
      },
    ];

    const postModels = await PostModel.aggregate(aggregationPipeline);

    return postModels.map((data) => PostMapper.toResponse(data));
  }
}
