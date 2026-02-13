import { User } from "../entities/User";

export interface IUpdateProfile {
  execute(input: UpdateProfileInput): Promise<User>;
}

export interface UpdateProfileInput extends UpdateProfileInputDto {
  userId: string;
  profileImageFile?: Express.Multer.File;
}

export interface UpdateProfileInputDto {
  firstname: string;
  lastname: string;
  username: string;
  mobile: string;
  password?: string;
  newPassword?: string;
  dob?: Date;
  gender?: "m" | "f";
}
