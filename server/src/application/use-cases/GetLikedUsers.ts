import {
  ILikeRepository,
  LikeableType,
} from "../../domain/repositories/ILikeRepository";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { UserListResponseDto } from "../dtos/UserListResponseDto";
import { HttpError } from "../../infrastructure/errors/HttpError";

export interface GetLikedUsersInput {
  targetId: string;
  type: LikeableType;
  page: number;
  limit: number;
}

export class GetLikedUsers {
  constructor(
    private likeRepository: ILikeRepository,
    private targetRepository: IPostRepository
  ) {}

  async execute(input: GetLikedUsersInput): Promise<UserListResponseDto[]> {
    const { targetId, type, page, limit } = input;

    const post = await this.targetRepository.findById(targetId);
    if (!post) {
      throw new HttpError(404, "Post not found or has been deleted.");
    }

    return this.likeRepository.findLikersByTarget(targetId, type, page, limit);
  }
}
