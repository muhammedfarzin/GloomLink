import { EnrichedPost } from "../repositories/IPostRepository";
import { UserListViewDto } from "../../application/dtos/UserDto";

export type SearchResult = UserListViewDto | EnrichedPost;

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
