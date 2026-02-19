import { injectable, inject } from "inversify";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";
import {
  ITogglePostStatus,
  type TogglePostStatusInput,
  type TogglePostStatusOutput,
} from "../../domain/use-cases/ITogglePostStatus";

@injectable()
export class TogglePostStatus implements ITogglePostStatus {
  constructor(
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository,
  ) {}

  async execute(input: TogglePostStatusInput): Promise<TogglePostStatusOutput> {
    const { postId } = input;

    const post = await this.postRepository.findById(postId);
    if (!post || post.getStatus() === "deleted") {
      throw new HttpError(404, "Post not found or has been deleted");
    }

    const newStatus = post.getStatus() === "active" ? "blocked" : "active";
    post.updateStatus(newStatus);

    await this.postRepository.update(postId, post);

    return { updatedStatus: newStatus };
  }
}
