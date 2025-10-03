import { injectable, inject } from "inversify";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

export interface DeletePostInput {
  postId: string;
  userId: string;
  userRole: "user" | "admin";
}

@injectable()
export class DeletePost {
  constructor(
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository
  ) {}

  async execute(input: DeletePostInput): Promise<void> {
    const { postId, userId, userRole } = input;

    const post = await this.postRepository.findById(postId);
    if (!post || post.status === "deleted") {
      return;
    }

    // --- AUTHORIZATION LOGIC ---
    if (userRole !== "admin" && post.userId.toString() !== userId) {
      throw new HttpError(403, "You are not authorized to delete this post");
    }
    await this.postRepository.deleteById(postId);
  }
}
