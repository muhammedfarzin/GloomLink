import { injectable, inject } from "inversify";
import {
  IPostRepository,
  EnrichedPost,
} from "../../domain/repositories/IPostRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

export interface GetPostByIdInput {
  postId: string;
  userId: string;
}

@injectable()
export class GetPostById {
  constructor(
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository
  ) {}

  async execute(input: GetPostByIdInput): Promise<EnrichedPost> {
    const post = await this.postRepository.findEnrichedById(
      input.postId,
      input.userId
    );

    if (!post) {
      throw new HttpError(404, "Post not found or has been removed.");
    }

    return post;
  }
}
