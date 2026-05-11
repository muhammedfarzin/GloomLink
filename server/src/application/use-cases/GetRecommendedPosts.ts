import { inject, injectable } from "inversify";
import { TYPES } from "@/shared/types";
import type { IInteractionRepository } from "@/domain/repositories/IInteractionRepository";
import type { IPostRepository } from "@/domain/repositories/IPostRepository";
import type { IFollowRepository } from "@/domain/repositories/IFollowRepository";
import type { EnrichedPost } from "@/domain/models/Post";
import type {
  IGetRecommendedPosts,
  GetRecommendedPostsInput,
} from "@/domain/use-cases/IGetRecommendedPosts";

@injectable()
export class GetRecommendedPosts implements IGetRecommendedPosts {
  constructor(
    @inject(TYPES.InteractionRepository)
    private interactionRepository: IInteractionRepository,
    @inject(TYPES.IPostRepository)
    private postRepository: IPostRepository,
    @inject(TYPES.IFollowRepository)
    private followRepository: IFollowRepository,
  ) {}

  async execute(input: GetRecommendedPostsInput): Promise<EnrichedPost[]> {
    const { userId, page, limit } = input;
    // 1. Fetch top interest tags directly from DB
    const interestKeywords =
      await this.interactionRepository.getTopInteractedTags(userId, 10);

    // 2. Get following users (to boost their content)
    const following = await this.followRepository.findFollowing(userId);
    const followingUserIds = following.map((f) => f.getFollowingId());

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
