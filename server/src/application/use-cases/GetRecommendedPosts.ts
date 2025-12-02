import { inject, injectable } from "inversify";
import { TYPES } from "../../shared/types";
import { IInteractionRepository } from "../../domain/repositories/IInteractionRepository";
import {
  IPostRepository,
  EnrichedPost,
} from "../../domain/repositories/IPostRepository";
import { IFollowRepository } from "../../domain/repositories/IFollowRepository";

@injectable()
export class GetRecommendedPosts {
  constructor(
    @inject(TYPES.InteractionRepository)
    private interactionRepository: IInteractionRepository,
    @inject(TYPES.IPostRepository)
    private postRepository: IPostRepository,
    @inject(TYPES.IFollowRepository)
    private followRepository: IFollowRepository
  ) {}

  async execute(
    userId: string,
    page: number,
    limit: number
  ): Promise<EnrichedPost[]> {
    // 1. Fetch top interest tags directly from DB
    const interestKeywords =
      await this.interactionRepository.getTopInteractedTags(userId, 10);

    // 2. Get following users (to boost their content)
    const following = await this.followRepository.findFollowing(userId);
    const followingUserIds = following.map((f) => f.followingTo);

    // 3. Fetch recommended posts
    return this.postRepository.findAndSortFeed({
      userId,
      interestKeywords,
      followingUserIds,
      page,
      limit,
    });
  }
}
