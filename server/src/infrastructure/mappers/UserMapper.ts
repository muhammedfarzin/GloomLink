import { User } from "../../domain/entities/User";
import type { UserListView } from "../../domain/models/User";
import type { UserDto } from "../../application/dtos/UserDto";
import type {
  UserBasicDto,
  UserWithAuthDto,
  UserWithStatusDto,
} from "../../application/dtos/UserDto";

export class UserMapper {
  public static toDomain(data: Omit<UserDto, "fullname">): User {
    return new User({
      ...data,
      savedPosts: data.savedPosts?.map((postId) => postId.toString()),
      blockedUsers: data.blockedUsers?.map((postId) => postId.toString()),
    });
  }

  private static toBasicPersistence(user: User): UserBasicDto {
    return {
      userId: user.getId(),
      username: user.getUsername(),
      fullname: user.getFullName(),
      firstname: user.getFirstName(),
      lastname: user.getLastName(),
      email: user.getEmail(),
      mobile: user.getMobile(),
      imageUrl: user.getImageUrl(),
      dob: user.getDateOfBirth(),
      gender: user.getGender(),
    };
  }

  public static toPersistence(user: User): UserDto {
    return {
      ...UserMapper.toBasicPersistence(user),
      email: user.getEmail(),
      passwordHash: user.getPasswordHash(),
      authType: user.getAuthType(),
      status: user.getStatus(),
      blockedUsers: user.getBlockedUsers(),
      savedPosts: user.getSavedPosts(),
      interestKeywords: user.getInterestKeywords(),
    };
  }

  public static toResponseWithStatus(user: User): UserWithStatusDto {
    return {
      ...UserMapper.toBasicPersistence(user),
      status: user.getStatus(),
    };
  }

  public static toResponseWithAuthType(user: User): UserWithAuthDto {
    return {
      ...UserMapper.toBasicPersistence(user),
      authType: user.getAuthType(),
    };
  }

  public static toListView(user: any): UserListView {
    return {
      ...UserMapper.toBasicPersistence(user),
      type: "user",
    };
  }
}
