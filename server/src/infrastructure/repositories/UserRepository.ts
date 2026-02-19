import { injectable } from "inversify";
import mongoose, { type PipelineStage } from "mongoose";
import { PostMapper } from "../mappers/PostMapper";
import { UserDocument, UserModel } from "../database/models/UserModel";
import { UserMapper } from "../mappers/UserMapper";

import type {
  IUserRepository,
  UserIdentifier,
  UserOptions,
  UserStatus,
} from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import type { EnrichedPost } from "../../domain/models/Post";
import type {
  UserDto,
  UserListViewDto,
  UserProfileResponseDto,
} from "../../application/dtos/UserDto";
import type { UserCompactProfile } from "../../domain/models/UserCompactProfile";

@injectable()
export class UserRepository implements IUserRepository {
  async create(userData: User): Promise<User> {
    const userToPersist = UserMapper.toPersistence(userData);
    const newUserModel = new UserModel(userToPersist);
    const userDoc = await newUserModel.save();
    return UserMapper.toDomain(this.safeParseUserDoc(userDoc));
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) return null;

    return UserMapper.toDomain(this.safeParseUserDoc(userDoc));
  }

  async findByUsername(username: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) return null;

    return UserMapper.toDomain(this.safeParseUserDoc(userDoc));
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id);
    if (!userDoc) return null;

    return UserMapper.toDomain(this.safeParseUserDoc(userDoc));
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

    return UserMapper.toDomain(this.safeParseUserDoc(userDoc));
  }

  async checkUserExist(
    query: UserIdentifier,
  ): Promise<
    { isExists: false } | { isExists: true; data: User; field: string }
  > {
    for (const [field, value] of Object.entries(query)) {
      if (!value) continue;

      const userDoc = await UserModel.findOne({ [field]: value });

      if (userDoc) {
        return {
          isExists: true,
          field,
          data: UserMapper.toDomain(this.safeParseUserDoc(userDoc)),
        };
      }
    }

    return { isExists: false };
  }

  async update(id: string, userData: User): Promise<User | null> {
    const {
      userId: _userId,
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

    return UserMapper.toDomain(this.safeParseUserDoc(updatedUserDoc));
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
                      userId: "$_id",
                      _id: 0,
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
                postId: "$_id",
                likesCount: { $size: "$likes" },
                commentsCount: { $size: "$comments" },
                isLiked: { $in: [userObjectId, "$likes.userId"] },
                isSaved: true,
              },
            },
            { $project: { _id: 0, likes: 0, comments: 0 } },
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
  ): Promise<UserProfileResponseDto | null> {
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
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "userId",
          as: "posts",
          pipeline: [
            { $match: { status: "active" } },
            { $sort: { createdAt: -1 } },
            { $limit: limit },
            { $project: { tags: 0 } },
          ],
        },
      },
      {
        $addFields: {
          followersCount: { $size: "$followers" },
          followingCount: { $size: "$following" },
          isFollowing: viewerId
            ? { $in: [viewerId, "$followers.followedBy"] }
            : undefined,
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          firstname: 1,
          lastname: 1,
          fullname: 1,
          imageUrl: 1,
          posts: 1,
          followersCount: 1,
          followingCount: 1,
          isFollowing: 1,
        },
      },
    ];

    const results = await UserModel.aggregate(aggregationPipeline);

    if (results.length === 0) {
      return null;
    }

    const profileData = results[0];

    if (viewerId && viewerId.toString() === profileData._id.toString()) {
      delete profileData.isFollowing;
    }

    return PostMapper.toProfileResponse(profileData);
  }

  async findByStatus(
    status: UserStatus,
    options: UserOptions,
  ): Promise<UserListViewDto[]> {
    const { userId, searchQuery = "", page, limit } = options;
    const skip = (page - 1) * limit;

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: {
          status,
          $or: [
            { username: { $regex: searchQuery, $options: "i" } },
            { firstname: { $regex: searchQuery, $options: "i" } },
            { lastname: { $regex: searchQuery, $options: "i" } },
          ],
        },
      },
      { $skip: skip },
      { $limit: limit },
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
          fullname: {
            $concat: [`$firstname`, " ", `$lastname`],
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: 1,
          firstname: 1,
          lastname: 1,
          imageUrl: "$image",
          isFollowing: 1,
          type: "user",
        },
      },
    ];

    const users = await UserModel.aggregate(aggregationPipeline);
    return users;
  }

  async findAll(options: {
    filter?: "all" | "active" | "blocked";
    searchQuery?: string;
    page: number;
    limit: number;
  }): Promise<User[]> {
    const { filter = "all", searchQuery = "", page, limit } = options;
    const skip = (page - 1) * limit;

    const matchStage: PipelineStage.Match["$match"] = {
      $or: [
        { username: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
        { mobile: { $regex: searchQuery, $options: "i" } },
      ],
    };

    if (filter !== "all") {
      matchStage.status = filter;
    }

    const aggregationPipeline: PipelineStage[] = [
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const userList = await UserModel.aggregate(aggregationPipeline);

    return userList.map((user) => {
      return UserMapper.toDomain({ ...user, userId: user._id.toString() });
    });
  }

  async findSuggestions(
    userId: string,
    excludeIds: string[],
    limit: number,
  ): Promise<UserListViewDto[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const excludeObjectIds = excludeIds.map(
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
              $sample: { size: limit * 2 },
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
      { $limit: limit },
      { $replaceRoot: { newRoot: "$doc" } },
      {
        $project: {
          _id: 0,
          type: "user",
          userId: { $toString: "$_id" },
          username: 1,
          fullname: {
            $concat: ["$firstname", " ", "$lastname"],
          },
          firstname: 1,
          lastname: 1,
          imageUrl: 1,
          isFollowing: {
            $eq: [
              { $toString: { $arrayElemAt: ["$followDoc.followedBy", 0] } },
              userId,
            ],
          },
        },
      },
    ];

    const users = await UserModel.aggregate(aggregationPipeline);
    return users;
  }

  private safeParseUserDoc(userDoc: UserDocument): Omit<UserDto, "fullname"> {
    const {
      _id: userId,
      savedPosts,
      blockedUsers,
      ...userObj
    } = userDoc.toObject();

    return {
      ...userObj,
      userId: userId.toString(),
      savedPosts: savedPosts.map((ids: any) => ids.toString()),
      blockedUsers: blockedUsers.map((ids: any) => ids.toString()),
    };
  }
}
