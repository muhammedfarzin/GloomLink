import type { User } from "../entities/User";
import type { EnrichedPost } from "../models/Post";

export type SearchResult = { users: User[]; posts: EnrichedPost[] };

export interface ISearchContent {
  execute(input: SearchContentInput): Promise<SearchResult>;
}

export interface SearchContentInput {
  searchQuery: string;
  filter: "all" | "users" | "posts";
  page: number;
  limit: number;
  currentUserId?: string;
}
