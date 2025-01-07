import { RequestHandler } from "express";
import { userRepository } from "../../infrastructure/repositories/UserRepository";

export const fetchAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await userRepository.findAll();

    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const blockUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const updatedUser = await userRepository.updateStatusById(
      userId,
      "blocked"
    );

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const unblockUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const updatedUser = await userRepository.updateStatusById(userId, "active");

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
};
