import { inject, injectable } from "inversify";
import { TYPES } from "@/shared/types";
import type { IUserActivityRepository } from "@/domain/repositories/IUserActivityRepository";
import type { IPostRepository } from "@/domain/repositories/IPostRepository";
import type { IFollowRepository } from "@/domain/repositories/IFollowRepository";
import type { EnrichedPost } from "@/domain/models/Post";
import type { IGetPosts, GetPostsInput } from "@/domain/use-cases/IGetPosts";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { User } from "@/domain/entities/User";

@injectable()
export class GetPosts implements IGetPosts {
  constructor(
    @inject(TYPES.UserActivityRepository)
    private userActivityRepository: IUserActivityRepository,
    @inject(TYPES.IPostRepository)
    private postRepository: IPostRepository,
    @inject(TYPES.IFollowRepository)
    private followRepository: IFollowRepository,
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository,
  ) {}

  async execute(input: GetPostsInput): Promise<EnrichedPost[]> {
    const { userId, authorUsername } = input;
    // 1. Fetch top interest tags directly from DB
    const getInterestKeywordsPromise =
      this.userActivityRepository.getTopInteractedTags(userId, 20);
    // 2. Get following users (to boost their content)
    const getFollowingPromise = this.followRepository.findFollowing(userId);
    let getAuthorPromise: Promise<User | null> | undefined;

    if (authorUsername) {
      getAuthorPromise = this.userRepository.findByUsername(authorUsername);
    }

    const [interestKeywords, following, author] = await Promise.all([
      getInterestKeywordsPromise,
      getFollowingPromise,
      getAuthorPromise,
    ]);

    if (authorUsername && !author) {
      return [];
    }

    const followingUserIds = following.map((f) => f.getFollowingId());

    // 3. Fetch recommended posts
    return this.postRepository.findAndSortFeed({
      ...input,
      authorId: author?.getId(),
      interestKeywords,
      followingUserIds,
    });
  }
}
