import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TokenPayloadType } from "../../application/services/token.service";

export const authenticateToken: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      throw new HttpError(401, "Unauthorized: No token provided");
    }

    const data = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as TokenPayloadType;

    req.user = data;
    next();
  } catch (error) {
    next(error);
  }
};
