export interface TokenPayload {
  role: "user" | "admin";
  id: string;
}

export interface AccessToken {
  accessToken: string;
}

export interface Tokens extends AccessToken {
  refreshToken?: string;
}

export interface TokensWithRefresh extends AccessToken {
  refreshToken: string;
}

export interface ITokenService {
  generate(payload: TokenPayload): Tokens;
  generate(payload: TokenPayload, withRefreshToken: true): TokensWithRefresh;
  generate(payload: TokenPayload, withRefreshToken: false): AccessToken;
  generate(payload: TokenPayload, withRefreshToken?: boolean): Tokens;
  verify(token: string, type: "access" | "refresh"): TokenPayload;
}
