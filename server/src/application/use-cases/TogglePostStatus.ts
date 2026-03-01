import { injectable, inject } from "inversify";
import { PostNotFoundError } from "../../domain/errors/NotFoundErrors";
import { TYPES } from "../../shared/types";
import type { IPostRepository } from "../../domain/repositories/IPostRepository";
import type {
  ITogglePostStatus,
  TogglePostStatusInput,
  TogglePostStatusOutput,
} from "../../domain/use-cases/ITogglePostStatus";

@injectable()
export class TogglePostStatus implements ITogglePostStatus {
  constructor(
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository,
  ) {}

  async execute(input: TogglePostStatusInput): Promise<TogglePostStatusOutput> {
    const { postId } = input;

    const post = await this.postRepository.findById(postId);
    if (!post || post.isDeleted()) {
      throw new PostNotFoundError();
    }

    const newStatus = post.isActive() ? "blocked" : "active";
    post.updateStatus(newStatus);

    await this.postRepository.update(postId, post);

    return { updatedStatus: newStatus };
  }
}
