import { injectable, inject } from "inversify";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

export interface TogglePostStatusInput {
  postId: string;
}

export interface TogglePostStatusOutput {
  updatedStatus: "active" | "blocked";
}

@injectable()
export class TogglePostStatus {
  constructor(
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository
  ) {}

  async execute(input: TogglePostStatusInput): Promise<TogglePostStatusOutput> {
    const { postId } = input;

    const post = await this.postRepository.findById(postId);
    if (!post || post.status === "deleted") {
      throw new HttpError(404, "Post not found or has been deleted");
    }

    const newStatus = post.status === "active" ? "blocked" : "active";

    await this.postRepository.update(postId, { status: newStatus });

    return { updatedStatus: newStatus };
  }
}
