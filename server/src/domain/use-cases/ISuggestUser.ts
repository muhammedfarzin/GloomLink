import type { UserListView } from "../models/User";

export interface ISuggestUser {
  execute(input: SuggestUserInput): Promise<UserListView[]>;
}

export interface SuggestUserInput {
  userId: string;
  excludeIds: string[];
  limit: number;
}
