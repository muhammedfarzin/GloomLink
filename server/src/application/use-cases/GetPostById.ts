import { injectable, inject } from "inversify";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { HttpError } from "../../interface-adapters/errors/HttpError";
import { TYPES } from "../../shared/types";
import {
  IGetPostById,
  type GetPostByIdInput,
} from "../../domain/use-cases/IGetPostById";
import type { EnrichedPost } from "../../domain/models/Post";

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
      throw new HttpError(404, "Post not found or has been removed.");
    }

    return post;
  }
}
