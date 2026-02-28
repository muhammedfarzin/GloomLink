import { User } from "../entities/User";

export interface IFetchUser {
  execute(userId: string, options?: FetchUserOptions): Promise<User>;
}

export interface FetchUserOptions {
  allowNotVerified?: boolean;
}
