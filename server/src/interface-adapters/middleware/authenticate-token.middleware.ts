import { RequestHandler } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { HttpError } from "../errors/HttpError";
import { TokenPayloadType } from "../../types/tokens";
import container from "../../shared/inversify.config";
import { TYPES } from "../../shared/types";
import { UserNotFoundError } from "../../domain/errors/NotFoundErrors";
import type { IFetchUser } from "../../domain/use-cases/IFetchUser";

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

    const fetchUserUseCase = container.get<IFetchUser>(TYPES.IFetchUser);

    if (data.role === "user") {
      const user = await fetchUserUseCase.execute(data.id, {
        allowNotVerified: true,
      });

      if (!user) throw new HttpError(401, "Unauthorized: User not found");
      if (user.isBlocked())
        throw new HttpError(401, "Unauthorized: User has been blocked");
      if (
        !user.isVerified() &&
        !req.originalUrl.startsWith("/api/user/signup/verify-otp")
      ) {
        throw new HttpError(403, "Forbidden: User not verified");
      }

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
    if (error instanceof UserNotFoundError) {
      next(new HttpError(401, "Unauthorized: User not found"));
    } else if (
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError
    ) {
      next(new HttpError(401, "Your token has been expired"));
    } else {
      next(error);
    }
  }
};
