import { User } from "../../domain/entities/User";
import type { UserDto } from "../../application/dtos/UserDto";
import type {
  UserWithStatusDto,
  UserWithAuthDto,
  UserListViewDto,
} from "../../application/dtos/UserDto";
import type { UserCompactProfile } from "../../domain/models/UserCompactProfile";

export class UserMapper {
  public static toDomain(data: Omit<UserDto, "fullname">): User {
    return new User(data);
  }

  private static toBasicPersistence(user: User): UserCompactProfile {
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
      ...this.toBasicPersistence(user),
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
      ...this.toBasicPersistence(user),
      status: user.getStatus(),
    };
  }

  public static toResponseWithAuthType(user: User): UserWithAuthDto {
    return {
      ...this.toBasicPersistence(user),
      authType: user.getAuthType(),
    };
  }

  public static toListView(user: any): UserListViewDto {
    return {
      ...this.toBasicPersistence(user),
      type: "user",
    };
  }
}
