import type { UserCompact } from "../models/User";

export interface ISuggestUser {
  execute(input: SuggestUserInput): Promise<UserCompact[]>;
}

export interface SuggestUserInput {
  userId: string;
  excludeIds: string[];
  limit: number;
}
