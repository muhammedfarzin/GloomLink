import { injectable, inject } from "inversify";
import { PostNotFoundError } from "@/domain/errors/NotFoundErrors";
import { TYPES } from "@/shared/types";
import type { IUserActivityRepository } from "@/domain/repositories/IUserActivityRepository";
import type { IPostRepository } from "@/domain/repositories/IPostRepository";
import type { UserCompact } from "@/domain/models/User";
import type {
  IGetLikedUsers,
  GetLikedUsersInput,
} from "@/domain/use-cases/IGetLikedUsers";

@injectable()
export class GetLikedUsers implements IGetLikedUsers {
  constructor(
    @inject(TYPES.UserActivityRepository) private userActivityRepository: IUserActivityRepository,
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository,
  ) {}

  async execute(input: GetLikedUsersInput): Promise<UserCompact[]> {
    const { targetId, type, ...restInput } = input;

    const post = await this.postRepository.findById(targetId);
    if (!post) {
      throw new PostNotFoundError();
    }

    return this.userActivityRepository.getUsersByTarget(targetId, {
      ...restInput,
      targetType: type,
      action: "like",
    });
  }
}
