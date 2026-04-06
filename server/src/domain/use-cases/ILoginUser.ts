import type { User } from "../entities/User";
import type { Tokens } from "../services/ITokenService";

export interface ILoginUser {
  execute(input: LoginInput): Promise<UserWithTokens>;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface UserWithTokens {
  user: User;
  tokens: Tokens;
}
