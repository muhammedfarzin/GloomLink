import { UserDocument, UserModel } from "../database/models/UserModel";
import { HttpError } from "../errors/HttpError";
import bcrypt from "bcryptjs";

class UserRepository {
  async create(
    userData: Omit<
      UserDocument,
      "conversations" | "blockedUsers" | "savedPosts"
    >
  ): Promise<UserDocument> {
    const user = new UserModel(userData);
    return await user.save();
  }

  async verifyUser(username: string, password: string): Promise<boolean> {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return false;
    }

    return await bcrypt.compare(password, user.password);
  }
}

export const userRepository = new UserRepository();
