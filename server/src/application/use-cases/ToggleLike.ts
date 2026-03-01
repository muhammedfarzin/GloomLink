import { injectable, inject } from "inversify";
import { Like } from "../../domain/entities/Like";
import { NotFoundError } from "../../domain/errors/NotFoundErrors";
import { TYPES } from "../../shared/types";
import type { ILikeRepository } from "../../domain/repositories/ILikeRepository";
import type { IPostRepository } from "../../domain/repositories/IPostRepository";
import type {
  IToggleLike,
  ToggleLikeInput,
  ToggleLikeOutput,
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
      throw new NotFoundError(
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
