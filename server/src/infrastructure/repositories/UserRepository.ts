import {
  type User,
  type UserDocument,
  UserModel,
} from "../database/models/UserModel";
import bcrypt from "bcryptjs";
import { otpRepository } from "./OtpRepository";
import { HttpError } from "../errors/HttpError";
import type { ProjectionType } from "mongoose";
import { FollowModel } from "../database/models/FollowModel";

class UserRepository {
  async create(
    userData: Omit<User, "_id" | "status" | "blockedUsers" | "savedPosts">
  ): Promise<UserDocument> {
    await this.userExists(userData, true);

    const user = new UserModel(userData);
    const newUser = await user.save();
    await otpRepository.generateOtp(userData);

    return newUser;
  }

  async findById(userId: string, projection?: ProjectionType<User>) {
    const user = await UserModel.findById(
      userId,
      projection || {
        blockedUsers: 0,
        savedPosts: 0,
        password: 0,
      }
    );
    return user?.toObject();
  }

  async findOne(filter: Partial<User>, projection?: ProjectionType<User>) {
    const user = await UserModel.findOne(
      filter,
      projection || {
        password: 0,
        blockedUsers: 0,
        savedPosts: 0,
      }
    );
    return user?.toObject();
  }

  async findByUsername(username: string) {
    const user = await UserModel.findOne({ username });
    if (!user) return null;

    const { password: _, ...result } = user.toObject();
    return result;
  }

  async findAll(
    filter: Partial<
      Omit<User, "blockedUsers" | "savedPosts" | "password">
    > = {},
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;
    const users = await UserModel.find(filter, {
      blockedUsers: 0,
      savedPosts: 0,
      password: 0,
    })
      .skip(skip)
      .limit(limit);
    return users.map((user) => user.toObject());
  }

  async updateById(userID: string, update: Partial<User>) {
    return await UserModel.updateOne({ _id: userID }, update);
  }

  async updateStatusById(userId: string, status: User["status"]) {
    await this.updateById(userId, { status });
    return await this.findById(userId);
  }

  async userExists(
    query: Pick<User, "username" | "email" | "mobile">,
    throwIfExist: boolean
  ) {
    const { username, email, mobile } = query;

    let user = await UserModel.findOne({ username });
    if (user) {
      if (throwIfExist) throw new HttpError(400, "Username already exists");
      return user;
    }

    user = await UserModel.findOne({ email });
    if (user) {
      if (throwIfExist) throw new HttpError(400, "Email already exists");
      return user;
    }

    user = await UserModel.findOne({ mobile });
    if (user) {
      if (throwIfExist) throw new HttpError(400, "Mobile already exists");
      return user;
    }
    return false;
  }

  async verifyUser(
    identifier: string,
    password: string,
    returnData?: false
  ): Promise<boolean>;

  async verifyUser(
    identifier: string,
    password: string,
    returnData: true
  ): Promise<UserDocument | false>;

  async verifyUser(
    identifier: string,
    password: string,
    returnData?: boolean
  ): Promise<UserDocument | boolean> {
    const user = await UserModel.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { mobile: identifier },
      ],
    });
    if (!user) {
      return false;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return false;
    }
    if (returnData) {
      return user;
    }
    return true;
  }

  async fetchProfileDetails(username: string) {
    const data = await UserModel.aggregate([
      { $match: { username } },
      {
        $addFields: {
          fullname: { $concat: ["$firstname", " ", "$lastname"] },
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "userId",
          as: "posts",
        },
      },
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
        $project: {
          username: 1,
          firstname: 1,
          lastname: 1,
          fullname: 1,
          image: 1,
          followersCount: { $size: "$followers" },
          followingCount: { $size: "$following" },
          posts: 1,
        },
      },
    ]);
    return data[0];
  }

  async followUser(followedBy: string, followingTo: string) {
    const followData = new FollowModel({
      followedBy,
      followingTo,
    });

    await followData.save();
  }

  async unfollowUser(followedBy: string, followingTo: string) {
    await FollowModel.findOneAndDelete({ followedBy, followingTo });
  }

  async checkIsFollowing(followedBy: string, followingTo: string) {
    const follow = await FollowModel.findOne({ followedBy, followingTo });
    return !!follow;
  }
}

export const userRepository = new UserRepository();
