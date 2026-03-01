import { injectable, inject } from "inversify";
import { ForbiddenError } from "../../domain/errors/AuthErrors";
import { TYPES } from "../../shared/types";
import type { IPostRepository } from "../../domain/repositories/IPostRepository";
import type {
  IDeletePost,
  DeletePostInput,
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
      throw new ForbiddenError("You are not authorized to delete this post");
    }
    await this.postRepository.deleteById(postId);
  }
}
