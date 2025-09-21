import {
  IPostRepository,
  EnrichedPost,
} from "../../domain/repositories/IPostRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";

export interface GetPostByIdInput {
  postId: string;
  userId: string;
}

export class GetPostById {
  constructor(private postRepository: IPostRepository) {}

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
