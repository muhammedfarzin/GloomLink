import { injectable, inject } from "inversify";
import { PostNotFoundError } from "../../domain/errors/NotFoundErrors";
import { TYPES } from "../../shared/types";
import type { ILikeRepository } from "../../domain/repositories/ILikeRepository";
import type { IPostRepository } from "../../domain/repositories/IPostRepository";
import type { UserListView } from "../../domain/models/User";
import type {
  IGetLikedUsers,
  GetLikedUsersInput,
} from "../../domain/use-cases/IGetLikedUsers";

@injectable()
export class GetLikedUsers implements IGetLikedUsers {
  constructor(
    @inject(TYPES.ILikeRepository) private likeRepository: ILikeRepository,
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository,
  ) {}

  async execute(input: GetLikedUsersInput): Promise<UserListView[]> {
    const { targetId, ...restInput } = input;

    const post = await this.postRepository.findById(targetId);
    if (!post) {
      throw new PostNotFoundError();
    }

    return this.likeRepository.findLikersByTarget(targetId, restInput);
  }
}
