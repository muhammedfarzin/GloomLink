import { RequestHandler } from "express";
import { TokenPayloadType } from "../../application/services/token.service";
import { HttpError } from "../../infrastructure/errors/HttpError";

export const authorizeRole = (
  role: TokenPayloadType["role"]
): RequestHandler => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      if (req.user.role === role) {
        return next();
      }
      throw new HttpError(403, "You are not allowed to do this operation");
    } catch (error) {
      next(error);
    }
  };
};
