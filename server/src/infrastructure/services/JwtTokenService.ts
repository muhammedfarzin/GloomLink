import jwt from "jsonwebtoken";
import {
  ITokenService,
  TokenPayload,
  Tokens,
} from "../../application/services/ITokenService";
import { HttpError } from "../errors/HttpError";

export class JwtTokenService implements ITokenService {
  private readonly accessSecret = process.env.JWT_ACCESS_SECRET || "secret";
  private readonly refreshSecret =
    process.env.JWT_REFRESH_SECRET || "refresh_secret";

  generate(payload: TokenPayload, withRefreshToken: boolean = true): Tokens {
    const accessToken = jwt.sign(payload, this.accessSecret, {
      expiresIn: "10m",
    });

    let refreshToken: string | undefined;
    if (withRefreshToken) {
      refreshToken = jwt.sign(payload, this.refreshSecret, {
        expiresIn: "30d",
      });
    }

    return { accessToken, refreshToken };
  }

  verify(token: string, type: "access" | "refresh"): TokenPayload {
    const secret = type === "access" ? this.accessSecret : this.refreshSecret;
    try {
      const { id, role } = jwt.verify(token, secret) as any;
      if (!id || !role) {
        throw new Error();
      }
      return { id, role };
    } catch (error) {
        
      throw new HttpError(403, `Invalid or expired ${type} token.`);
    }
  }
}
