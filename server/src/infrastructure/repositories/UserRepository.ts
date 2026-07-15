import { injectable } from "inversify";
import mongoose, { type PipelineStage } from "mongoose";
import { PostMapper } from "../mappers/PostMapper";
import { UserModel } from "../database/models/UserModel";
import { UserMapper } from "../mappers/UserMapper";

import { User } from "@/domain/entities/User";
import type { EnrichedPost } from "@/domain/models/Post";
import type { UserCompact, UserProfile } from "@/domain/models/User";
import type {
  IUserRepository,
  SuggestionInput,
  UserDashboardMetrics,
  UserFindOptions,
  UserIdentifier,
} from "@/domain/repositories/IUserRepository";

@injectable()
export class UserRepository implements IUserRepository {
  async create(userData: User): Promise<User> {
    const userToPersist = UserMapper.toPersistence(userData);
    const newUserModel = new UserModel(userToPersist);
    const userDoc = await newUserModel.save();
    return UserMapper.toDomain(userDoc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) return null;

    return UserMapper.toDomain(userDoc);
  }

  async findByUsername(username: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) return null;

    return UserMapper.toDomain(userDoc);
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id);
    if (!userDoc) return null;

    return UserMapper.toDomain(userDoc);
  }

  async findByIdentifier(identifier: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { mobile: identifier },
      ],
    });

    if (!userDoc) return null;

    return UserMapper.toDomain(userDoc);
  }

  async checkUserExist(
    query: UserIdentifier,
  ): Promise<
    { isExists: false } | { isExists: true; data: User; field: string }
  > {
    const { username, email, mobile } = query;
    for (const [field, value] of Object.entries({ username, email, mobile })) {
      if (!value) continue;

      const userDoc = await UserModel.findOne({ [field]: value });

      if (userDoc) {
        return {
          isExists: true,
          field,
          data: UserMapper.toDomain(userDoc),
        };
      }
    }

    return { isExists: false };
  }

  async update(id: string, userData: User): Promise<User | null> {
    const {
      id: _id,
      email: _email,
      blockedUsers: _blockedUser,
      savedPosts: _savedPost,
      interestKeywords,
      ...userToPersist
    } = UserMapper.toPersistence(userData);

    const updatedUserDoc = await UserModel.findByIdAndUpdate(
      id,
      { $set: userToPersist },
      { new: true },
    );

    if (!updatedUserDoc) return null;

    return UserMapper.toDomain(updatedUserDoc);
  }

  async findSavedPosts(
    userId: string,
    page: number,
    limit: number,
  ): Promise<EnrichedPost[]> {
    const skip = (page - 1) * limit;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const aggregationPipeline: PipelineStage[] = [
      { $match: { _id: userObjectId } },
      {
        $lookup: {
          from: "posts",
          localField: "savedPosts",
          foreignField: "_id",
          as: "savedPostsData",
          pipeline: [
            { $match: { status: "active" } },
            { $skip: skip },
            { $limit: limit },
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
                id: "$_id",
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
      { $project: { _id: 0, savedPostsData: 1 } },
    ];

    const results = await UserModel.aggregate(aggregationPipeline);
    return results[0].savedPostsData.map(PostMapper.toResponse);
  }

  async savePost(userId: string, postId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $addToSet: { savedPosts: postId } },
    );
  }

  async unsavePost(userId: string, postId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { savedPosts: postId } },
    );
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

    const results = await UserModel.aggregate(aggregationPipeline);

    if (results.length === 0) {
      return null;
    }

    const profileData = results[0];

    if (viewerId && viewerId.toString() === profileData.id.toString()) {
      delete profileData.isFollowing;
    }

    return UserMapper.toProfile(profileData);
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

    const userList = await UserModel.aggregate(aggregationPipeline);

    return userList.map((user) => {
      return UserMapper.toDomain({ ...user, userId: user._id.toString() });
    });
  }

  async findSuggestions(input: SuggestionInput): Promise<UserCompact[]> {
    const userObjectId = new mongoose.Types.ObjectId(input.userId);
    const excludeObjectIds = input.excludeIds.map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: {
          _id: { $nin: [...excludeObjectIds, userObjectId] },
          status: "active",
        },
      },
      {
        $facet: {
          following: [
            {
              $lookup: {
                from: "follows",
                let: { potentialUserId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$followedBy", userObjectId] },
                          { $eq: ["$followingTo", "$$potentialUserId"] },
                        ],
                      },
                    },
                  },
                ],
                as: "followDoc",
              },
            },
            { $match: { "followDoc.0": { $exists: true } } },
          ],
          random: [
            {
              $sample: { size: input.limit * 2 },
            },
          ],
        },
      },
      {
        $project: {
          suggestions: { $concatArrays: ["$following", "$random"] },
        },
      },
      { $unwind: "$suggestions" },
      {
        $group: {
          _id: "$suggestions._id",
          doc: { $first: "$suggestions" },
        },
      },
      { $limit: input.limit },
      { $replaceRoot: { newRoot: "$doc" } },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          username: 1,
          fullname: {
            $concat: ["$firstname", " ", "$lastname"],
          },
          firstname: 1,
          lastname: 1,
          imageUrl: 1,
          status: 1,
          isFollowing: {
            $eq: [
              { $toString: { $arrayElemAt: ["$followDoc.followedBy", 0] } },
              input.userId,
            ],
          },
          type: "user",
        },
      },
    ];

    const users = await UserModel.aggregate(aggregationPipeline);
    return users;
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

    const totalUsers = await UserModel.countDocuments();
    const newUsers = await UserModel.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    const newUsersAgg = await UserModel.aggregate([
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
}
