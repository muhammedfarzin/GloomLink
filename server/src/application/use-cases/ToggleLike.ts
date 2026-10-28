import { injectable, inject } from "inversify";
import { NotFoundError } from "@/domain/errors/NotFoundErrors";
import { TYPES } from "@/shared/types";
import type { IUserActivityRepository } from "@/domain/repositories/IUserActivityRepository";
import type { IPostRepository } from "@/domain/repositories/IPostRepository";
import type {
  IToggleLike,
  ToggleLikeInput,
  ToggleLikeOutput,
} from "@/domain/use-cases/IToggleLike";

@injectable()
export class ToggleLike implements IToggleLike {
  constructor(
    @inject(TYPES.UserActivityRepository) private userActivityRepository: IUserActivityRepository,
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository,
  ) {}

  async execute(input: ToggleLikeInput): Promise<ToggleLikeOutput> {
    const target = await this.postRepository.findById(input.targetId);
    if (!target) {
      throw new NotFoundError(
        `${input.type[0].toUpperCase() + input.type.slice(1)} not found`,
      );
    }

    const isLiked = await this.userActivityRepository.toggleLike(
      input.userId,
      input.targetId,
      input.type,
    );
    return { status: isLiked ? "liked" : "unliked" };
  }
}
