import { injectable, inject } from "inversify";
import {
  ILikeRepository,
  LikeableType,
} from "../../domain/repositories/ILikeRepository";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { UserListResponseDto } from "../dtos/UserListResponseDto";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

export interface GetLikedUsersInput {
  targetId: string;
  userId?: string;
  type: LikeableType;
  page: number;
  limit: number;
}

@injectable()
export class GetLikedUsers {
  constructor(
    @inject(TYPES.ILikeRepository) private likeRepository: ILikeRepository,
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository
  ) {}

  async execute(input: GetLikedUsersInput): Promise<UserListResponseDto[]> {
    const { targetId, ...restInput } = input;

    const post = await this.postRepository.findById(targetId);
    if (!post) {
      throw new HttpError(404, "Post not found or has been deleted.");
    }

    return this.likeRepository.findLikersByTarget(targetId, restInput);
  }
}
