import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserModel } from "../database/models/UserModel";
import { UserMapper } from "../database/mappers/UserMapper";
import { EnrichedPost } from "../../domain/repositories/IPostRepository";
import mongoose, { PipelineStage } from "mongoose";
import { PostMapper } from "../database/mappers/PostMapper";
import { UserProfileResponseDto } from "../../application/dtos/UserProfileResponseDto";
import { UserListResponseDto } from "../../application/dtos/UserListResponseDto";

export class UserRepository implements IUserRepository {
  async create(userData: Partial<User>): Promise<User> {
    const userToPersist = UserMapper.toPersistence(userData);
    const newUserModel = new UserModel(userToPersist);
    const savedUser = await newUserModel.save();
    return UserMapper.toDomain(savedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userModel = await UserModel.findOne({ email });
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const userModel = await UserModel.findOne({ username });
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async findById(id: string): Promise<User | null> {
    const userModel = await UserModel.findById(id);
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async findByIdentifier(identifier: string): Promise<User | null> {
    const userModel = await UserModel.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { mobile: identifier },
      ],
    });
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async checkUserExist(
    query: Pick<User, "username" | "email" | "mobile">
  ): Promise<{ exist: false } | { exist: true; data: User; field: string }> {
    const { username, email, mobile } = query;

    let user = await UserModel.findOne({ username });
    if (user) {
      return {
        exist: true,
        field: "username",
        data: UserMapper.toDomain(user),
      };
    }

    user = await UserModel.findOne({ email });
    if (user) {
      return { exist: true, field: "email", data: UserMapper.toDomain(user) };
    }

    user = await UserModel.findOne({ mobile });
    if (user) {
      return { exist: true, field: "mobile", data: UserMapper.toDomain(user) };
    }

    return { exist: false };
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const userToPersist = UserMapper.toPersistence(userData);
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: userToPersist },
      { new: true }
    );
    return updatedUser ? UserMapper.toDomain(updatedUser) : null;
  }

  async findSavedPosts(
    userId: string,
    page: number,
    limit: number
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
                      username: 1,
                      firstname: 1,
                      lastname: 1,
                      image: 1,
                    },
                  },
                ],
              },
            },
            { $unwind: "$uploadedBy" },
            {
              $addFields: {
                likeCount: { $size: "$likes" },
                commentCount: { $size: "$comments" },
                isLiked: { $in: [userObjectId, "$likes.userId"] },
                isSaved: true,
              },
            },
            { $project: { likes: 0, comments: 0 } },
          ],
        },
      },
      { $project: { _id: 0, savedPostsData: 1 } },
    ];

    const results = await UserModel.aggregate(aggregationPipeline);

    return results[0].savedPostsData.map((post: any) =>
      PostMapper.toResponse(post)
    );
  }

  async savePost(userId: string, postId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $addToSet: { savedPosts: postId } }
    );
  }

  async unsavePost(userId: string, postId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { savedPosts: postId } }
    );
  }

  async findProfileByUsername(
    username: string,
    currentUserId: string,
    limit = 15
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
          image: 1,
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
    status: "active" | "blocked" | "inactive",
    options: {
      userId?: string;
      searchQuery?: string;
      page: number;
      limit: number;
    }
  ): Promise<UserListResponseDto[]> {
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
        },
      },
      {
        $project: {
          username: 1,
          firstname: 1,
          lastname: 1,
          image: 1,
          isFollowing: 1,
        },
      },
    ];

    const users = await UserModel.aggregate(aggregationPipeline);
    return users.map(UserMapper.toListView);
  }
}
