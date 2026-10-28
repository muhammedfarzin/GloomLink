import { injectable, inject } from "inversify";
import type { IUserActivityRepository } from "@/domain/repositories/IUserActivityRepository";
import type { EnrichedPost } from "@/domain/models/Post";
import { TYPES } from "@/shared/types";
import type {
  IGetSavedPosts,
  GetSavedPostsInput,
} from "@/domain/use-cases/IGetSavedPosts";

@injectable()
export class GetSavedPosts implements IGetSavedPosts {
  constructor(
    @inject(TYPES.UserActivityRepository)
    private userActivityRepository: IUserActivityRepository,
  ) {}

  async execute(input: GetSavedPostsInput): Promise<EnrichedPost[]> {
    return this.userActivityRepository.getSavedPosts(
      input.userId,
      input.page,
      input.limit,
    );
  }
}
