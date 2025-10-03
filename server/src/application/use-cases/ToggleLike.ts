import { injectable, inject } from "inversify";
import { ILikeRepository } from "../../domain/repositories/ILikeRepository";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

export interface ToggleLikeInput {
  targetId: string;
  userId: string;
  type: "post";
}

export interface ToggleLikeOutput {
  status: "liked" | "unliked";
}

@injectable()
export class ToggleLike {
  constructor(
    @inject(TYPES.ILikeRepository) private likeRepository: ILikeRepository,
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository
  ) {}

  async execute(input: ToggleLikeInput): Promise<ToggleLikeOutput> {
    const target = await this.postRepository.findById(input.targetId);
    if (!target) {
      throw new HttpError(
        404,
        `${input.type[0].toUpperCase() + input.type.slice(1)} not found`
      );
    }

    const existingLike = await this.likeRepository.findByTargetAndUser(
      input.targetId,
      input.userId,
      input.type
    );

    if (existingLike) {
      await this.likeRepository.delete(existingLike._id);
      return { status: "unliked" };
    } else {
      await this.likeRepository.create(input);
      return { status: "liked" };
    }
  }
}
