import { User } from "../entities/User";

export interface IFetchUser {
  execute(userId: string): Promise<User>;
}
