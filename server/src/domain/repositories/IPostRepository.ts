import type { Post } from "../entities/Post";
import type { EnrichedPost } from "../models/Post";
import type { IBaseRepository } from "./IBaseRepository";

export interface IPostRepository extends IBaseRepository<Post> {
  create(post: Post): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findByIds(ids: string[]): Promise<Post[]>;
  findEnrichedById(
    postId: string,
    userId: string,
  ): Promise<EnrichedPost | null>;
  findAndSortFeed(options: PostFeedOptions): Promise<EnrichedPost[]>;
  findAll(options: {
    page: number;
    limit: number;
    searchQuery?: string;
    withReports?: boolean;
  }): Promise<EnrichedPost[]>;
  findByStatus(
    status: "active" | "blocked",
    options: {
      page: number;
      limit: number;
      searchQuery?: string;
      withReports?: boolean;
    },
  ): Promise<EnrichedPost[]>;
  findReported(options: {
    page: number;
    limit: number;
    searchQuery?: string;
  }): Promise<EnrichedPost[]>;
  update(post: Post): Promise<Post | null>;
  deleteById(id: string): Promise<Post | null>;
  getDashboardMetrics(
    startDate: Date,
    endDate: Date,
  ): Promise<PostDashboardMetrics>;
}

export interface PostDashboardMetrics {
  totalPosts: number;
  chartData: { date: string; count: number }[];
}

export interface PostFeedOptions {
  userId?: string;
  authorId?: string;
  searchQuery?: string;
  interestKeywords?: string[];
  followingUserIds?: string[];
  sort?: "relevant" | "latest" | "oldest";
  page: number;
  limit: number;
}
