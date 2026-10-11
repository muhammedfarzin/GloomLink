import { Mapper } from "./Mapper";
import { injectable } from "inversify";
import { User } from "@/domain/entities/User";
import type { UserProfile, UserSelf } from "@/domain/models/User";
import type { UserResponseDto } from "@/application/dtos/UserDto";
import type { UserDocument } from "../database/models/UserModel";

@injectable()
export class UserMapper extends Mapper<User, UserDomainProps> {
  public toDomain(data: UserDomainProps): User {
    return new User({
      id: data.id?.toString(),
      username: data.username,
      passwordHash: data.passwordHash,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      mobile: data.mobile,
      authType: data.authType,
      status: data.status,
      imageUrl: data.imageUrl,
      gender: data.gender,
      dob: data.dob,
      isFollowing: data.isFollowing,
      interestKeywords: data.interestKeywords,
      savedPosts: data.savedPosts?.map((postId) => postId.toString()),
      blockedUsers: data.blockedUsers?.map((postId) => postId.toString()),
    });
  }

  public toPersistence(user: User): UserSelf {
    return {
      ...this.toResponse(user),
      email: user.getEmail(),
      mobile: user.getMobile(),
      dob: user.getDateOfBirth(),
      gender: user.getGender(),
      passwordHash: user.getPasswordHash(),
      authType: user.getAuthType(),
      status: user.getStatus(),
      blockedUsers: user.getBlockedUsers(),
      savedPosts: user.getSavedPosts(),
      interestKeywords: user.getInterestKeywords(),
    };
  }

  public toResponse(user: User): UserResponseDto {
    return {
      id: user.getId(),
      username: user.getUsername(),
      fullname: user.getFullName(),
      firstname: user.getFirstName(),
      lastname: user.getLastName(),
      imageUrl: user.getImageUrl(),
      status: user.getStatus(),
      isFollowing: user.isFollowingUser(),
      type: "user",
    };
  }

  public toProfile(data: any): UserProfile {
    return {
      id: data.id?.toString(),
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      fullname: `${data.firstname} ${data.lastname}`,
      imageUrl: data.imageUrl,
      followersCount: data.followersCount,
      followingCount: data.followingCount,
      status: data.status,
      isFollowing: data.isFollowing,
      type: "user",
    };
  }
}

type UserDomainProps =
  | Omit<UserSelf, "fullname">
  | (UserDocument & { isFollowing?: boolean });
