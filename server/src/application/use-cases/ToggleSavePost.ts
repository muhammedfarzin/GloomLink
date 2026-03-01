import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/types";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { IPostRepository } from "../../domain/repositories/IPostRepository";
import type {
  IToggleSavePost,
  ToggleSavePostInput,
  ToggleSavePostOutput,
} from "../../domain/use-cases/IToggleSavePost";
import {
  PostNotFoundError,
  UserNotFoundError,
} from "../../domain/errors/NotFoundErrors";

@injectable()
export class ToggleSavePost implements IToggleSavePost {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository,
  ) {}

  async execute(input: ToggleSavePostInput): Promise<ToggleSavePostOutput> {
    const { userId, postId } = input;
    const user = await this.userRepository.findById(userId);
    const post = await this.postRepository.findById(postId);
    if (!user) {
      throw new UserNotFoundError();
    }
    if (!post) {
      throw new PostNotFoundError();
    }

    const isAlreadySaved = user.getSavedPosts().includes(postId);

    if (isAlreadySaved) {
      await this.userRepository.unsavePost(userId, postId);
      return { status: "unsaved" };
    } else {
      await this.userRepository.savePost(userId, postId);
      return { status: "saved" };
    }
  }
}
