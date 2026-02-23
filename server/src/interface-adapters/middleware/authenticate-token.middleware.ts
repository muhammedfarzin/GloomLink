import { RequestHandler } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TokenPayloadType } from "../../types/tokens";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";

export const authenticateToken: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      throw new HttpError(401, "Unauthorized: No token provided");
    }

    const data = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "secret",
    ) as TokenPayloadType;

    const userRepository = new UserRepository();

    if (data.role === "user") {
      const user = await userRepository.findById(data.id);
      if (!user) throw new HttpError(401, "Unauthorized: User not found");
      if (user.isBlocked())
        throw new HttpError(401, "Unauthorized: User has been blocked");

      req.user = {
        role: "user",
        id: user.getId(),
        username: user.getUsername(),
        firstname: user.getFirstName(),
        lastname: user.getLastName(),
        email: user.getEmail(),
        status: user.getStatus(),
        authType: user.getAuthType(),
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
