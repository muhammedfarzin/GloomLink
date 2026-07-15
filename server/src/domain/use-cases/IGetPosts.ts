import type { EnrichedPost } from "../models/Post";

export interface IGetPosts {
  execute(input: GetPostsInput): Promise<EnrichedPost[]>;
}

export interface GetPostsInput {
  userId: string;
  authorUsername?: string;
  sort?: "relevant" | "latest" | "oldest";
  page: number;
  limit: number;
}
