import { UserWithStatusDto } from "../../application/dtos/UserDto";

export interface IGetAdminUsers {
  execute(input: GetAdminUsersInput): Promise<UserWithStatusDto[]>;
}

export interface GetAdminUsersInput {
  filter: "all" | "active" | "blocked";
  page: number;
  limit: number;
  searchQuery?: string;
}
