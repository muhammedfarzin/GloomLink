import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";

export interface TogglePostStatusInput {
  postId: string;
}

export interface TogglePostStatusOutput {
  updatedStatus: "active" | "blocked";
}

export class TogglePostStatus {
  constructor(private postRepository: IPostRepository) {}

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
