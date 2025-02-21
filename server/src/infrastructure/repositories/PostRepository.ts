import {
  Types,
  type Document,
  type ProjectionType,
  type Schema,
} from "mongoose";
import { PostModel, type Post } from "../database/models/PostModel";
import { UserModel } from "../database/models/UserModel";
import { HttpError } from "../errors/HttpError";
import { userRepository } from "./UserRepository";
import { ReportModel } from "../database/models/ReportModel";
import fs from "fs";
import path from "path";

const postDataAggregate = (userId: string) => [
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
      as: "liked",
      pipeline: [
        {
          $match: {
            userId: Types.ObjectId.createFromHexString(userId),
          },
        },
      ],
    },
  },
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "targetId",
      as: "commentsCount",
    },
  },
  {
    $lookup: {
      from: "likes",
      localField: "_id",
      foreignField: "targetId",
      as: "likesCount",
    },
  },
  {
    $addFields: {
      liked: { $gt: [{ $size: "$liked" }, 0] },
      commentsCount: { $size: "$commentsCount" },
      likesCount: { $size: "$likesCount" },
    },
  },
];

async function addSavedPostField(userId: string, posts: any[]) {
  const user = await userRepository.findById(userId, { savedPosts: 1 });
  if (!user) throw new HttpError(401, "Unauthorized");
  const savedPosts = user.savedPosts.map((post) => post.toString());

  const resPosts = posts.map((post) => {
    post.saved = savedPosts.includes(post._id.toString());
    return post;
  });

  return resPosts;
}

class PostRepository {
  async createPost(
    postData: Omit<Post, "_id" | "status" | "userId"> & { userId: string }
  ) {
    const { caption, images, publishedFor, tags, userId } = postData;

    if (
      !publishedFor ||
      (publishedFor !== "public" && publishedFor !== "subscriber")
    ) {
      throw new HttpError(400, "Please provide valid publishedFor");
    }

    const newPost = new PostModel({
      caption,
      images,
      publishedFor,
      tags,
      userId,
    });

    const post = await newPost.save();
    return post.toObject();
  }

  async editPost(
    postId: string,
    postData: Pick<Post, "caption" | "images" | "publishedFor" | "tags"> & {
      removedImages: string[];
    }
  ) {
    const { caption, images, publishedFor, tags, removedImages } = postData;

    if (
      !publishedFor ||
      (publishedFor !== "public" && publishedFor !== "subscriber")
    ) {
      throw new HttpError(400, "Please provide valid publishedFor");
    }

    await PostModel.findByIdAndUpdate(postId, {
      $set: { caption, publishedFor, tags },
      $push: { images },
    });

    const post = await PostModel.findByIdAndUpdate(
      postId,
      { $pull: { images: { $in: removedImages } } },
      { new: true }
    );

    removedImages.map((image) =>
      fs.unlink(path.join("public", image), (err) => {
        if (err) console.error(err);
      })
    );

    return post?.toObject();
  }

  async findById(
    postId: string,
    projection?: ProjectionType<Post> | null,
    returnDocument?: false
  ): Promise<
    | (Post &
        Required<{
          _id: Schema.Types.ObjectId;
        }>)
    | null
  >;
  async findById(
    postId: string,
    projection?: ProjectionType<Post> | null,
    returnDocument?: true
  ): Promise<
    | (Document<unknown, {}, Post> &
        Post &
        Required<{
          _id: Schema.Types.ObjectId;
        }> & {
          __v: number;
        })
    | null
  >;
  async findById(
    postId: string,
    projection?: ProjectionType<Post> | null,
    returnDocument: boolean = true
  ): Promise<any> {
    const post = await PostModel.findById(postId, projection);

    return returnDocument ? post : post?.toObject();
  }

  async checkPostExist(postId: string): Promise<boolean> {
    const post = await PostModel.findById(postId);
    return !!post;
  }

  async getPostsForAdmin(
    filter?: "active" | "blocked" | "reported",
    query?: string
  ) {
    if (filter === "reported") {
      var posts = await ReportModel.aggregate([
        {
          $group: {
            _id: "$targetId",
            reportCount: { $sum: 1 },
          },
        },
        { $limit: 20 },
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "_id",
            as: "posts",
            pipeline: [
              {
                $match: {
                  status: { $ne: "deleted" },
                  $or: [
                    { caption: { $regex: query || "", $options: "i" } },
                    {
                      tags: query
                        ? { $in: query?.toLowerCase().split(" ") }
                        : {},
                    },
                  ],
                },
              },
            ],
          },
        },
        { $unwind: "$posts" },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  _id: "$_id",
                  reportCount: "$reportCount",
                },
                "$posts",
              ],
            },
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
                  image: 1,
                  firstname: 1,
                  lastname: 1,
                },
              },
            ],
          },
        },
      ]);
    } else {
      var posts = await PostModel.aggregate([
        {
          $match: {
            status: filter ? { $eq: filter } : { $ne: "deleted" },
            $or: [
              { caption: { $regex: query || "", $options: "i" } },
              { tags: query?.toLowerCase().split(" ") },
            ],
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
                  image: 1,
                  firstname: 1,
                  lastname: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "reports",
            localField: "_id",
            foreignField: "targetId",
            as: "reports",
          },
        },
        { $limit: 20 },
        {
          $project: {
            userId: 1,
            caption: 1,
            images: 1,
            tags: 1,
            publishedFor: 1,
            createdAt: 1,
            status: 1,
            uploadedBy: 1,
            reportCount: { $size: "$reports" },
          },
        },
        { $unwind: "$uploadedBy" },
      ]);
    }

    return posts;
  }

  async getPostsForUser(userId: string) {
    const interestKeywords = await userRepository.fetchInterestKeywords(userId);
    const interestKeywordsRegex = interestKeywords.map(
      (word) => new RegExp(word, "i")
    );
    const followingUsers = await userRepository.fetchFollowing(
      userId,
      userId,
      "following"
    );
    const followingUserIds: string[] = followingUsers.map((user) =>
      user._id.toString()
    );

    const posts = await PostModel.aggregate([
      {
        $match: {
          status: "active",
        },
      },
      ...postDataAggregate(userId),
      {
        $addFields: {
          relevanceScore: {
            $sum: [
              {
                $size: {
                  $setIntersection: ["$tags", interestKeywords],
                },
              },
              { $cond: [{ $in: ["$caption", interestKeywordsRegex] }, 1, 0] },
              {
                $cond: [
                  { $in: [{ $toString: "$userId" }, followingUserIds] },
                  1,
                  0,
                ],
              },
              { $cond: [{ $eq: [{ $toString: "$userId" }, userId] }, -2, 0] },
            ],
          },
        },
      },
      { $sort: { relevanceScore: -1, updatedAt: -1 } },
      { $limit: 20 },
    ]);

    const resPosts = await addSavedPostField(userId, posts);

    return resPosts;
  }

  async getSavedPost(userId: string) {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) throw new HttpError(404, "User not found");

    const savedPosts = await PostModel.aggregate([
      { $match: { _id: { $in: user.savedPosts }, status: "active" } },
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
      { $limit: 20 },
      { $unwind: "$uploadedBy" },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "targetId",
          as: "commentsCount",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "targetId",
          as: "likesCount",
        },
      },
      {
        $addFields: {
          saved: true,
          commentsCount: { $size: "$commentsCount" },
          likesCount: { $size: "$likesCount" },
        },
      },
    ]);

    return savedPosts;
  }

  async checkIsSaved(userId: string, postId: string) {
    const user = await UserModel.findById(userId);
    const savedPosts = user?.savedPosts.filter(
      (post) => post.toString() === postId
    );
    return !!savedPosts?.length;
  }

  async reportPost(postId: string, userId: string) {
    const reportExist = await ReportModel.findOne({
      reportedBy: userId,
      targetId: postId,
      type: "post",
    });

    if (reportExist) return;

    const report = new ReportModel({
      reportedBy: userId,
      targetId: postId,
      type: "post",
    });

    await report.save();
  }

  async blockPost(postId: string) {
    await PostModel.findByIdAndUpdate(postId, { status: "blocked" });
  }

  async unblockPost(postId: string) {
    await PostModel.findByIdAndUpdate(postId, { status: "active" });
  }

  async deletePost(postId: string) {
    await PostModel.findByIdAndUpdate(postId, { status: "deleted" });
    await ReportModel.deleteMany({ targetId: postId });
  }

  async search(userId: string, query: string) {
    const searchRegex = new RegExp(query, "i");
    const searchWords = query.split(/\s+/).map((word) => new RegExp(word, "i"));

    const posts = await PostModel.aggregate([
      {
        $match: {
          $or: [
            { caption: searchRegex },
            { tags: { $elemMatch: { $in: searchWords } } },
          ],
        },
      },
      ...postDataAggregate(userId),
      { $addFields: { type: "post" } },
    ]);

    const postsWithSaved = await addSavedPostField(userId, posts);

    const sortedPosts = postsWithSaved.sort((a, b) => {
      const aTagMatches = a.tags.filter((tag: string) =>
        searchWords.some((word) => tag.match(word))
      ).length;
      const bTagMatches = b.tags.filter((tag: string) =>
        searchWords.some((word) => tag.match(word))
      ).length;

      return bTagMatches - aTagMatches;
    });

    return sortedPosts;
  }
}

export const postRepository = new PostRepository();
