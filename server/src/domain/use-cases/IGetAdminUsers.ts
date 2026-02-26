import type { User } from "../entities/User";

export interface IGetAdminUsers {
  execute(input: GetAdminUsersInput): Promise<User[]>;
}

export interface GetAdminUsersInput {
  filter: "all" | "active" | "blocked";
  page: number;
  limit: number;
  searchQuery?: string;
}
