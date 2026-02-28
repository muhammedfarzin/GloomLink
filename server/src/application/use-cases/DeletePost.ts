import { injectable, inject } from "inversify";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { HttpError } from "../../interface-adapters/errors/HttpError";
import { TYPES } from "../../shared/types";
import {
  IDeletePost,
  type DeletePostInput,
} from "../../domain/use-cases/IDeletePost";

@injectable()
export class DeletePost implements IDeletePost {
  constructor(
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository,
  ) {}

  async execute(input: DeletePostInput): Promise<void> {
    const { postId, userId, userRole } = input;

    const post = await this.postRepository.findById(postId);
    if (!post || post.isDeleted()) {
      return;
    }

    // --- AUTHORIZATION LOGIC ---
    if (userRole !== "admin" && post.getUserId() !== userId) {
      throw new HttpError(403, "You are not authorized to delete this post");
    }
    await this.postRepository.deleteById(postId);
  }
}
