import type { UserCompact } from "@/domain/models/User";

type AuthType = "email" | "google";

export type UserResponseDto = Pick<
  UserCompact,
  | "id"
  | "username"
  | "firstname"
  | "lastname"
  | "fullname"
  | "imageUrl"
  | "isFollowing"
  | "status"
  | "type"
>;

export interface UserDto extends UserResponseDto {
  email: string;
  mobile?: string;
  dob?: Date;
  gender?: "f" | "m";
  authType: AuthType;
}
