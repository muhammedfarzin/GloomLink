import { Request } from "express";
import jwt from "jsonwebtoken";

export type TokenPayloadType = NonNullable<Request["user"]>;
export interface TokensType {
  accessToken: string;
  refreshToken?: string;
}

export const generateToken = (
  payload: TokenPayloadType,
  withRefreshToken: boolean = true
): TokensType => {
  const { role, username } = payload;
  if (role !== "admin") {
    var { _id, email, status, authType } = payload as Partial<typeof payload>;
  }

  const data = { role, _id, username, email, status, authType };
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
