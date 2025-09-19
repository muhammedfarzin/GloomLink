import { Request } from "express";
import jwt from "jsonwebtoken";

export type TokenPayloadType = { role: "user" | "admin"; id: string };
export interface TokensType {
  accessToken: string;
  refreshToken?: string;
}

export const generateToken = (
  payload: TokenPayloadType,
  withRefreshToken: boolean = true
): TokensType => {
  const data = { role: payload.role, id: payload.id };
  const accessToken = jwt.sign(
    data,
    process.env.JWT_ACCESS_SECRET || "secret",
    {
      expiresIn: "10m",
    }
  );

  if (withRefreshToken) {
    var refreshToken: string | undefined = jwt.sign(
      data,
      process.env.JWT_REFRESH_SECRET || "refresh_secret",
      {
        expiresIn: "30d",
      }
    );
  }

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, type: "access" | "refresh") => {
  const secret =
    type === "access"
      ? process.env.JWT_ACCESS_SECRET
      : process.env.JWT_REFRESH_SECRET;

  const data = jwt.verify(token, secret || "secret") as TokenPayloadType;

  return data;
};
