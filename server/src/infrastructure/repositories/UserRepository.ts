import {
  type User,
  type UserDocument,
  UserModel,
} from "../database/models/UserModel";
import bcrypt from "bcryptjs";
import { otpRepository } from "./OtpRepository";
import { HttpError } from "../errors/HttpError";

class UserRepository {
  async create(
    userData: Omit<
      User,
      "_id" | "status" | "conversations" | "blockedUsers" | "savedPosts"
    >
  ): Promise<UserDocument> {
    const user = new UserModel(userData);
    const newUser = await user.save();
    await otpRepository.generateOtp(userData);

    return newUser;
  }

  async findByUsername(username: string) {
    const user = await UserModel.findOne({ username });
    if (!user) return null;

    const { password: _, ...result } = user.toObject();
    return result;
  }

  async updateById(userID: string, update: Partial<User> ) {
    return await UserModel.updateOne({ _id: userID }, update);
  }

  async userExists(username: string, email: string, throwIfExist: boolean) {
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
    return false;
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
