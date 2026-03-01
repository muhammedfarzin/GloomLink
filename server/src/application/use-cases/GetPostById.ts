import { injectable, inject } from "inversify";
import { PostNotFoundError } from "../../domain/errors/NotFoundErrors";
import { TYPES } from "../../shared/types";
import type { EnrichedPost } from "../../domain/models/Post";
import type { IPostRepository } from "../../domain/repositories/IPostRepository";
import type {
  IGetPostById,
  GetPostByIdInput,
} from "../../domain/use-cases/IGetPostById";

@injectable()
export class GetPostById implements IGetPostById {
  constructor(
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository,
  ) {}

  async execute(input: GetPostByIdInput): Promise<EnrichedPost> {
    const post = await this.postRepository.findEnrichedById(
      input.postId,
      input.userId,
    );

    if (!post) {
      throw new PostNotFoundError();
    }

    return post;
  }
}
