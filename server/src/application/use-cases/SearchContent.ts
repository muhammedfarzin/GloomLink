import { IUserRepository } from "../../domain/repositories/IUserRepository";
import {
  IPostRepository,
  EnrichedPost,
} from "../../domain/repositories/IPostRepository";
import { IFollowRepository } from "../../domain/repositories/IFollowRepository";
import { UserListResponseDto } from "../dtos/UserListResponseDto";

export type SearchResult = UserListResponseDto | EnrichedPost;

export interface SearchContentInput {
  searchQuery: string;
  filter: "all" | "users" | "posts";
  page: number;
  limit: number;
  currentUserId: string;
}

export class SearchContent {
  constructor(
    private userRepository: IUserRepository,
    private postRepository: IPostRepository,
    private followRepository: IFollowRepository
  ) {}

  async execute(input: SearchContentInput): Promise<SearchResult[]> {
    const { searchQuery, filter, page, limit, currentUserId } = input;
    let users: UserListResponseDto[] = [];
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
      const following = await this.followRepository.findFollowing(
        currentUserId
      );
      const followingUserIds = following.map((f) => f.followingTo);

      posts = await this.postRepository.findAndSortFeed({
        searchQuery,
        userId: currentUserId,
        interestKeywords: currentUser.interestKeywords,
        followingUserIds,
        page,
        limit,
      });
    }

    return [...users, ...posts];
  }
}
