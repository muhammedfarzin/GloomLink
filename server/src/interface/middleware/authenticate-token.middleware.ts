import { RequestHandler } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TokenPayloadType } from "../../application/services/token.service";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";

export const authenticateToken: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      throw new HttpError(401, "Unauthorized: No token provided");
    }

    const data = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "secret"
    ) as TokenPayloadType;

    const userRepository = new UserRepository();

    if (data.role === "user") {
      const userData = await userRepository.findById(data.id);
      if (!userData) throw new HttpError(401, "Unauthorized: User not found");
      if (userData.status === "blocked")
        throw new HttpError(401, "Unauthorized: User has been blocked");

      const { authType = "email", _id: userId } = userData;

      req.user = {
        role: "user",
        ...userData,
        id: userId.toString(),
        authType,
      };
    } else req.user = { role: "admin", id: data.id };

    next();
  } catch (error) {
    if (
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError
    ) {
      next(new HttpError(401, "Your token has been expired"));
    } else next(error);
  }
};
