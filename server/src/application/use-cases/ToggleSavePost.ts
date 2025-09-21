import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";

export class ToggleSavePost {
  constructor(
    private userRepository: IUserRepository,
    private postRepository: IPostRepository
  ) {}

  async execute(
    userId: string,
    postId: string
  ): Promise<{ status: "saved" | "unsaved" }> {
    const user = await this.userRepository.findById(userId);
    const post = await this.postRepository.findById(postId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    if (!post) {
      throw new HttpError(404, "Post not found or has been deleted");
    }

    const isAlreadySaved = user.savedPosts.includes(postId);

    if (isAlreadySaved) {
      await this.userRepository.unsavePost(userId, postId);
      return { status: "unsaved" };
    } else {
      await this.userRepository.savePost(userId, postId);
      return { status: "saved" };
    }
  }
}
