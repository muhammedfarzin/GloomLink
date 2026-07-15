import type { User } from "@/domain/entities/User";
import type { UserDto, UserResponseDto } from "@/application/dtos/UserDto";

export class UserMapper {
  public static toResponse(user: User): UserResponseDto {
    return {
      id: user.getId(),
      username: user.getUsername(),
      fullname: user.getFullName(),
      firstname: user.getFirstName(),
      lastname: user.getLastName(),
      imageUrl: user.getImageUrl(),
      isFollowing: user.isFollowingUser(),
      status: user.getStatus(),
      type: "user",
    };
  }

  public static toPersonalResponse(user: User): UserDto {
    return {
      ...UserMapper.toResponse(user),
      email: user.getAuthType(),
      mobile: user.getMobile(),
      dob: user.getDateOfBirth(),
      gender: user.getGender(),
      authType: user.getAuthType(),
    };
  }
}
