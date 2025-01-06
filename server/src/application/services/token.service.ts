import { Request } from "express";
import jwt from "jsonwebtoken";
import type { User } from "../../infrastructure/database/models/UserModel";

export type TokenPayloadType = NonNullable<Request["user"]>;

export const generateToken = (payload: TokenPayloadType) => {
  const { role, username } = payload;
  if (role !== "admin") {
    var {
      _id,
      email,
      mobile,
      status,
    }: { _id?: string; email?: string; mobile?: string; status?: string } =
      payload;
  }

  const data = { role, _id, username, email, mobile, status };
  const accessToken = jwt.sign(data, process.env.JWT_SECRET || "secret", {
    expiresIn: "10m",
  });

  if (payload.role !== "temp") {
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
