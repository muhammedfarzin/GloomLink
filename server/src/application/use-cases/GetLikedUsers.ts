import { injectable, inject } from "inversify";
import { ILikeRepository } from "../../domain/repositories/ILikeRepository";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { UserListViewDto } from "../dtos/UserDto";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";
import {
  IGetLikedUsers,
  type GetLikedUsersInput,
} from "../../domain/use-cases/IGetLikedUsers";

@injectable()
export class GetLikedUsers implements IGetLikedUsers {
  constructor(
    @inject(TYPES.ILikeRepository) private likeRepository: ILikeRepository,
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository,
  ) {}

  async execute(input: GetLikedUsersInput): Promise<UserListViewDto[]> {
    const { targetId, ...restInput } = input;

    const post = await this.postRepository.findById(targetId);
    if (!post) {
      throw new HttpError(404, "Post not found or has been deleted.");
    }

    return this.likeRepository.findLikersByTarget(targetId, restInput);
  }
}
