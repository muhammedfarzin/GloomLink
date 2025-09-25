import { Types } from "mongoose";
import { User } from "../../../domain/entities/User";
import { UserDocument } from "../models/UserModel";
import { UserAuthResponseDto } from "../../../application/dtos/UserAuthResponseDto";
import { UserFormViewDto } from "../../../application/dtos/UserFormViewDto";
import { UserListResponseDto } from "../../../application/dtos/UserListResponseDto";

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

  public static toAuthResponse(user: User): UserAuthResponseDto {
    return {
      _id: user._id?.toString(),
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      status: user.status,
      email: user.email,
      image: user.image,
    };
  }

  public static toFormView(user: User): UserFormViewDto {
    return {
      _id: user._id?.toString(),
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      mobile: user.mobile,
      authType: user.authType,
      dob: user.dob,
      gender: user.gender,
      image: user.image,
    };
  }

  public static toListView(user: User): UserListResponseDto {
    return {
      _id: user._id?.toString(),
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      image: user.image,
    };
  }
}
