import { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { userRepository } from "../../infrastructure/repositories/UserRepository";

export const fetchAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await userRepository.findAll();

    res.status(200).json({users})
  } catch (error) {
    next(error);
  }
};
