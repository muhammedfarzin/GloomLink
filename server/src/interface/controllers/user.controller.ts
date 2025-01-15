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

export const fetchMyData: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const userData = await userRepository.findById(req.user._id, {
      firstname: 1,
      lastname: 1,
      username: 1,
      email: 1,
      mobile: 1,
      gender: 1,
      dob: 1,
      image: 1,
    });

    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

export const fetchProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const username = req.params.username;
    const userData = await userRepository.fetchProfileDetails(username);
    if (!userData) throw new HttpError(404, "Not found");
    const isFollowing = await userRepository.checkIsFollowing(
      req.user._id,
      userData._id
    );

    res.json({ ...userData, isFollowing });
  } catch (error) {
    next(error);
  }
};

export const followUser: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    await userRepository.followUser(req.user._id, req.params.userId);

    res
      .status(200)
      .json({ userId: req.params.userId, message: "Followed successfully" });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    await userRepository.unfollowUser(req.user._id, req.params.userId);

    res
      .status(200)
      .json({ userId: req.params.userId, message: "Unfollowed successfully" });
  } catch (error) {
    next(error);
  }
};
