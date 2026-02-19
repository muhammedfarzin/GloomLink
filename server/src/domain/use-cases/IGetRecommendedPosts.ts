import type { EnrichedPost } from "../models/Post";

export interface IGetRecommendedPosts {
  execute(input: GetRecommendedPostsInput): Promise<EnrichedPost[]>;
}

export interface GetRecommendedPostsInput {
  userId: string;
  page: number;
  limit: number;
}
