import {
  type User,
  type UserDocument,
  UserModel,
} from "../database/models/UserModel";
import bcrypt from "bcryptjs";
import { otpRepository } from "./OtpRepository";
import { HttpError } from "../errors/HttpError";
import {
  isObjectIdOrHexString,
  Types,
  type Document,
  type ProjectionType,
  type Schema,
} from "mongoose";
import { FollowModel } from "../database/models/FollowModel";
import { extractKeywords } from "../../application/services/keyword.service";

class UserRepository {
  async create(
    userData: Omit<
      User,
      "_id" | "status" | "blockedUsers" | "savedPosts" | "interestKeywords"
    >
  ): Promise<UserDocument> {
    await this.userExists(userData, true);

    const user = new UserModel(userData);
    const newUser = await user.save();
    await otpRepository.generateOtp(userData);

    return newUser;
  }

  async findById(
    user: string,
    projection?: ProjectionType<User> | null,
    returnDocument?: false
  ): Promise<
    | (User &
        Required<{
          _id: Schema.Types.ObjectId;
        }>)
    | null
  >;
  async findById(
    user: string,
    projection?: ProjectionType<User> | null,
    returnDocument?: true
  ): Promise<
    | (Document<unknown, {}, User> &
        User &
        Required<{
          _id: Schema.Types.ObjectId;
        }> & {
          __v: number;
        })
    | null
  >;
  async findById(
    userId: string,
    projection?: ProjectionType<User> | null,
    returnDocument: boolean = false
  ): Promise<any> {
    const user = await UserModel.findById(
      userId,
      projection || {
        blockedUsers: 0,
        savedPosts: 0,
        password: 0,
      }
    );

    return returnDocument ? user : user?.toObject();
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

  async fetchProfileDetails(username: string, self: boolean) {
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
          pipeline: [
            {
              $match: {
                status: { $ne: "deleted", ...(self ? {} : { $eq: "active" }) },
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 20 },
          ],
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
          subscriptionAmount: 1,
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

  async fetchFollowers(userId: string) {
    if (!isObjectIdOrHexString(userId))
      throw new HttpError(400, "Invalid userId");

    const followers = await FollowModel.aggregate([
      { $match: { followingTo: Types.ObjectId.createFromHexString(userId) } },
      { $limit: 20 },
      {
        $lookup: {
          from: "users",
          localField: "followedBy",
          foreignField: "_id",
          as: "userData",
          pipeline: [
            {
              $project: {
                firstname: 1,
                lastname: 1,
                username: 1,
                image: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$userData" },
      { $replaceRoot: { newRoot: "$userData" } },
    ]);

    return followers;
  }

  async fetchFollowing(
    userId: string,
    myId: string,
    type: "followers" | "following",
    limit?: number
  ) {
    if (!isObjectIdOrHexString(userId))
      throw new HttpError(400, "Invalid userId");

    const followers = await FollowModel.aggregate([
      {
        $match: {
          [type === "followers" ? "followingTo" : "followedBy"]:
            Types.ObjectId.createFromHexString(userId),
        },
      },
      { $sample: { size: limit || 20 } },
      {
        $lookup: {
          from: "users",
          localField: type === "followers" ? "followedBy" : "followingTo",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      { $replaceRoot: { newRoot: "$userData" } },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followingTo",
          as: "isFollowing",
          pipeline: [
            {
              $match: { followedBy: Types.ObjectId.createFromHexString(myId) },
            },
          ],
        },
      },
      {
        $addFields: {
          isFollowing: { $gt: [{ $size: "$isFollowing" }, 0] },
        },
      },
    ]);

    return followers;
  }

  async search(userId: string, query: string) {
    const searchRegex = new RegExp(query, "i");
    const users = await UserModel.aggregate([
      {
        $match: {
          status: "active",
          _id: { $ne: Types.ObjectId.createFromHexString(userId) },
          $or: [
            { username: searchRegex },
            { firstname: searchRegex },
            { lastname: searchRegex },
          ],
        },
      },
      { $limit: 5 },
      { $project: { firstname: 1, lastname: 1, username: 1, image: 1 } },
      { $addFields: { type: "user" } },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followingTo",
          as: "isFollowing",
          pipeline: [
            {
              $match: {
                followedBy: Types.ObjectId.createFromHexString(userId),
              },
            },
          ],
        },
      },
      {
        $addFields: {
          isFollowing: { $gt: [{ $size: "$isFollowing" }, 0] },
        },
      },
    ]);

    const sortedUsers = users.sort((a, b) => {
      const aUsernameMatch = a.username === query ? 1 : 0;
      const bUsernameMatch = b.username === query ? 1 : 0;

      // First, prioritize username matches
      if (aUsernameMatch !== bUsernameMatch) {
        return bUsernameMatch - aUsernameMatch;
      }

      const aMatches = [a.username, a.firstname + a.lastname].filter(
        (field: string) => field.match(searchRegex)
      ).length;
      const bMatches = [b.username, b.firstname + b.lastname].filter(
        (field: string) => field.match(searchRegex)
      ).length;

      return bMatches - aMatches;
    });

    return sortedUsers;
  }

  async usernameToUserId(...username: string[]) {
    const users = await UserModel.find(
      { username: { $in: username } },
      { _id: 1 }
    );

    return users.map((user) => user._id);
  }

  async userIdToUsername(
    ...userId: (Types.ObjectId | Schema.Types.ObjectId)[]
  ) {
    const users = await UserModel.find(
      { _id: { $in: userId } },
      { username: 1 }
    );

    const response: Record<string, string> = {};
    users.forEach((user) => (response[user._id.toString()] = user.username));
    return response;
  }

  async fetchSuggestedUsers(
    userId: string,
    notUsers: Schema.Types.ObjectId[] = []
  ) {
    const suggestionLimit = 5;
    let users = await FollowModel.aggregate([
      {
        $match: {
          followingTo: { $nin: notUsers },
          followedBy: Types.ObjectId.createFromHexString(userId),
        },
      },
      { $sample: { size: 5 } },
      {
        $lookup: {
          from: "users",
          localField: "followingTo",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      { $replaceRoot: { newRoot: "$userData" } },
      { $project: { firstname: 1, lastname: 1, username: 1, image: 1 } },
    ]);

    if (users.length < suggestionLimit) {
      const userIdObj = Types.ObjectId.createFromHexString(userId);
      const otherUsers = await UserModel.aggregate([
        {
          $match: {
            _id: {
              $nin: [...notUsers, userIdObj, ...users.map((user) => user._id)],
            },
          },
        },
        { $sample: { size: suggestionLimit - users.length } },
        {
          $lookup: {
            from: "users",
            localField: "followingTo",
            foreignField: "_id",
            as: "userData",
          },
        },
        { $project: { firstname: 1, lastname: 1, username: 1, image: 1 } },
      ]);
      users = [...users, ...otherUsers];
    }

    return users;
  }

  async addInterestedKeywords(userId: string, keywordString: string) {
    const user = await UserModel.findById(userId);

    if (!user) return;

    const keywords = extractKeywords(keywordString);
    user.interestKeywords = [...keywords, ...user.interestKeywords];

    await user.save();
  }

  async fetchInterestKeywords(userId: string) {
    const user = await UserModel.findById(userId);
    return user?.interestKeywords || [];
  }
}

export const userRepository = new UserRepository();
