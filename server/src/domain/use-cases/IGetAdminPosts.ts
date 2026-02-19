import type { EnrichedPost } from "../models/Post";

export interface IGetAdminPosts {
  execute(input: GetAdminPostsInput): Promise<EnrichedPost[]>;
}

export interface GetAdminPostsInput {
  filter: "all" | "active" | "blocked" | "reported";
  page: number;
  limit: number;
  searchQuery?: string;
  withReports?: boolean;
}
