export interface TokenPayload {
  role: "user" | "admin";
  id: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

export interface ITokenService {
  generate(payload: TokenPayload, withRefreshToken?: boolean): Tokens;
  verify(token: string, type: "access" | "refresh"): TokenPayload;
}
