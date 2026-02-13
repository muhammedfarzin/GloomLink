import { Tokens } from "../services/ITokenService";

export interface IRefreshToken {
  execute(input: RefreshTokenInput): Promise<Tokens>;
}

export interface RefreshTokenInput {
  token: string;
}
