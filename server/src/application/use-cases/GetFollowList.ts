import {
  FollowListType,
  IFollowRepository,
} from "../../domain/repositories/IFollowRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserListResponseDto } from "../dtos/UserListResponseDto";
import { HttpError } from "../../infrastructure/errors/HttpError";

export interface GetFollowListInput {
  userId: string;
  type: FollowListType;
  page: number;
  limit: number;
}

export class GetFollowList {
  constructor(
    private followRepository: IFollowRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(input: GetFollowListInput): Promise<UserListResponseDto[]> {
    const { userId, type, ...restInput } = input;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError(404, "User not found or has been removed");
    }

    return this.followRepository.findFollowList(userId, type, restInput);
  }
}
