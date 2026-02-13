import { User } from "../entities/User";

export interface ILoginUser {
  execute(input: LoginInput): Promise<User>;
}

export interface LoginInput {
  username: string;
  password: string;
}
