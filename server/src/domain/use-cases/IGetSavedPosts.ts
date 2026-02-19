import type { EnrichedPost } from "../models/Post";

export interface IGetSavedPosts {
  execute(input: GetSavedPostsInput): Promise<EnrichedPost[]>;
}

export interface GetSavedPostsInput {
  userId: string;
  page: number;
  limit: number;
}
