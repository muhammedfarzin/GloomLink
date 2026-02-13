import { EnrichedPost } from "../repositories/IPostRepository";

export interface IGetRecommendedPosts {
  execute(input: GetRecommendedPostsInput): Promise<EnrichedPost[]>;
}

export interface GetRecommendedPostsInput {
  userId: string;
  page: number;
  limit: number;
}
