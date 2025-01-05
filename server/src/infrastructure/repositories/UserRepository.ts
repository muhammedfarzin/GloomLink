import {
  type User,
  type UserDocument,
  UserModel,
} from "../database/models/UserModel";
import bcrypt from "bcryptjs";

class UserRepository {
  async create(
    userData: Omit<
      User,
      "_id" | "status" | "conversations" | "blockedUsers" | "savedPosts"
    >
  ): Promise<UserDocument> {
    const user = new UserModel(userData);
    return await user.save();
  }

  async verifyUser(
    username: string,
    password: string,
    returnData?: false
  ): Promise<boolean>;

  async verifyUser(
    username: string,
    password: string,
    returnData: true
  ): Promise<UserDocument | false>;

  async verifyUser(
    username: string,
    password: string,
    returnData?: boolean
  ): Promise<UserDocument | boolean> {
    const user = await UserModel.findOne({ username });
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
}

export const userRepository = new UserRepository();
