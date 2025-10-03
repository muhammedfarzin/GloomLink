import { injectable, inject } from "inversify";
import {
  FollowListType,
  IFollowRepository,
} from "../../domain/repositories/IFollowRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserListResponseDto } from "../dtos/UserListResponseDto";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

export interface GetFollowListInput {
  userId: string;
  currentUserId?: string;
  type: FollowListType;
  page: number;
  limit: number;
}

@injectable()
export class GetFollowList {
  constructor(
    @inject(TYPES.IFollowRepository)
    private followRepository: IFollowRepository,
    @inject(TYPES.IUserRepository)
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
