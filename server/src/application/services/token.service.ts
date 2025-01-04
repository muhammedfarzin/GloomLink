import jwt from "jsonwebtoken";

export interface TokenPayloadType {
  data: any;
  role: "user" | "admin";
}

export const generateToken = (
  payload: TokenPayloadType,
  options?: jwt.SignOptions
) => {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET || "secret",
    options ?? {
      expiresIn: "5m",
    }
  );
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || "refresh_secret",
    options ?? {
      expiresIn: "30d",
    }
  );

  return {accessToken, refreshToken};
};
