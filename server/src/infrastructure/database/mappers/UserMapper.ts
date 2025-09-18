import { Types } from "mongoose";
import { User } from "../../../domain/entities/User";
import { UserDocument } from "../models/UserModel";

export class UserMapper {
  public static toDomain(userModel: UserDocument): User {
    const userObject = userModel.toObject<UserDocument>();

    return {
      ...userObject,
      _id: userObject._id.toString(),
      blockedUsers: userObject.blockedUsers.map((id) => id.toString()),
      savedPosts: userObject.savedPosts.map((id) => id.toString()),
    };
  }

  public static toPersistence(user: Partial<User>): any {
    const persistenceUser: any = {
      ...user,
      blockedUsers: user.blockedUsers?.map((id) => new Types.ObjectId(id)),
      savedPosts: user.savedPosts?.map((id) => new Types.ObjectId(id)),
    };

    if (user._id) {
      persistenceUser._id = new Types.ObjectId(user._id);
    }

    return persistenceUser;
  }
}
