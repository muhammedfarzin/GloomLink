import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";

export interface DeletePostInput {
  postId: string;
  userId: string;
  userRole: "user" | "admin";
}

export class DeletePost {
  constructor(private postRepository: IPostRepository) {}

  async execute(input: DeletePostInput): Promise<void> {
    const { postId, userId, userRole } = input;

    const post = await this.postRepository.findById(postId);
    if (!post || post.status === "deleted") {
      return;
    }

    // --- AUTHORIZATION LOGIC ---
    if (userRole !== 'admin' && post.userId.toString() !== userId) {
      throw new HttpError(403, "You are not authorized to delete this post");
    }
    await this.postRepository.deleteById(postId);
  }
}
