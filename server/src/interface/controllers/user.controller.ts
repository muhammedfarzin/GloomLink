import type { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { userRepository } from "../../infrastructure/repositories/UserRepository";

export const fetchMyProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const username = req.user.username;
    const userData = await userRepository.fetchProfileDetails(username);

    res.json(userData);
  } catch (error) {
    next(error);
  }
};
