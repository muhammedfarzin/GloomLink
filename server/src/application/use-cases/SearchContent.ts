import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/types";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { IPostRepository } from "../../domain/repositories/IPostRepository";
import type { IFollowRepository } from "../../domain/repositories/IFollowRepository";
import type { UserListView } from "../../domain/models/User";
import type { EnrichedPost } from "../../domain/models/Post";
import type {
  ISearchContent,
  SearchContentInput,
  SearchResult,
} from "../../domain/use-cases/ISearchContent";

@injectable()
export class SearchContent implements ISearchContent {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository,
    @inject(TYPES.IFollowRepository)
    private followRepository: IFollowRepository,
  ) {}

  async execute(input: SearchContentInput): Promise<SearchResult[]> {
    const { searchQuery, filter, page, limit, currentUserId } = input;
    let users: UserListView[] = [];
    let posts: EnrichedPost[] = [];

    const currentUser = await this.userRepository.findById(currentUserId);
    if (!currentUser) {
      return [];
    }

    if (filter === "all" || filter === "users") {
      users = await this.userRepository.findByStatus("active", {
        searchQuery,
        userId: currentUserId,
        page,
        limit: filter === "all" ? 5 : limit,
      });
    }

    if (filter === "all" || filter === "posts") {
      const following =
        await this.followRepository.findFollowing(currentUserId);
      const followingUserIds = following.map((f) => f.getFollowingId());

      posts = await this.postRepository.findAndSortFeed({
        searchQuery,
        userId: currentUserId,
        interestKeywords: currentUser.getInterestKeywords(),
        followingUserIds,
        page,
        limit,
      });
    }

    return [...users, ...posts];
  }
}
