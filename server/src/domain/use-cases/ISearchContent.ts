import type { EnrichedPost } from "../models/Post";
import type { UserListView } from "../models/User";

export type SearchResult = UserListView | EnrichedPost;

export interface ISearchContent {
  execute(input: SearchContentInput): Promise<SearchResult[]>;
}

export interface SearchContentInput {
  searchQuery: string;
  filter: "all" | "users" | "posts";
  page: number;
  limit: number;
  currentUserId: string;
}
