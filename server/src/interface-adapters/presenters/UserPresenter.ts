import type { User } from "../../domain/entities/User";
import type {
  UserBasicDto,
  UserWithAuthDto,
  UserWithStatusDto,
} from "../../application/dtos/UserDto";

export class UserPresenter {
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

  public static toResponseWithStatus(user: User): UserWithStatusDto {
    return {
      ...UserPresenter.toBasicPersistence(user),
      status: user.getStatus(),
    };
  }

  public static toResponseWithAuthType(user: User): UserWithAuthDto {
    return {
      ...UserPresenter.toBasicPersistence(user),
      authType: user.getAuthType(),
    };
  }
}
