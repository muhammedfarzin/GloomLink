import { injectable, inject } from "inversify";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";
import { Like } from "../../domain/entities/Like";
import type { ILikeRepository } from "../../domain/repositories/ILikeRepository";
import type { IPostRepository } from "../../domain/repositories/IPostRepository";
import {
  IToggleLike,
  type ToggleLikeInput,
  type ToggleLikeOutput,
} from "../../domain/use-cases/IToggleLike";

@injectable()
export class ToggleLike implements IToggleLike {
  constructor(
    @inject(TYPES.ILikeRepository) private likeRepository: ILikeRepository,
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository,
  ) {}

  async execute(input: ToggleLikeInput): Promise<ToggleLikeOutput> {
    const target = await this.postRepository.findById(input.targetId);
    if (!target) {
      throw new HttpError(
        404,
        `${input.type[0].toUpperCase() + input.type.slice(1)} not found`,
      );
    }

    const likeToCreate = new Like({ ...input, id: crypto.randomUUID() });
    const existingLike = await this.likeRepository.find(likeToCreate);

    if (existingLike) {
      await this.likeRepository.delete(existingLike.getId());
      return { status: "unliked" };
    } else {
      await this.likeRepository.create(likeToCreate);
      return { status: "liked" };
    }
  }
}
