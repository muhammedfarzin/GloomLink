import { injectable, inject } from "inversify";
import { TYPES } from "@/shared/types";
import type { IUserActivityRepository } from "@/domain/repositories/IUserActivityRepository";
import type { IUserRepository } from "@/domain/repositories/IUserRepository";
import type { IPostRepository } from "@/domain/repositories/IPostRepository";
import type {
  IToggleSavePost,
  ToggleSavePostInput,
  ToggleSavePostOutput,
} from "@/domain/use-cases/IToggleSavePost";
import {
  PostNotFoundError,
  UserNotFoundError,
} from "@/domain/errors/NotFoundErrors";

@injectable()
export class ToggleSavePost implements IToggleSavePost {
  constructor(
    @inject(TYPES.UserActivityRepository)
    private userActivityRepository: IUserActivityRepository,
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

    const isSaved = await this.userActivityRepository.toggleSavePost(
      userId,
      postId,
    );
    return { status: isSaved ? "saved" : "unsaved" };
  }
}
