import jwt from "jsonwebtoken";

export interface TokenPayloadType {
  data: any;
  role: "user" | "admin" | "temp";
}

export const generateToken = (payload: TokenPayloadType) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
    expiresIn: "5m",
  });

  if (payload.role !== "temp") {
    var refreshToken: string | undefined = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || "refresh_secret",
      {
        expiresIn: "30d",
      }
    );
  }

  return { accessToken, refreshToken };
};
