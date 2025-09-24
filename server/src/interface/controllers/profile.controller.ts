import type { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { PostRepository } from "../../infrastructure/repositories/PostRepository";
import { GetUserProfile } from "../../application/use-cases/GetUserProfile";

export const getUserProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const userRepository = new UserRepository();
    const getUserProfileUseCase = new GetUserProfile(userRepository);
    const userProfile = await getUserProfileUseCase.execute({
      username: req.params.username,
      currentUserId: req.user.id,
    });

    res.status(200).json({
      userData: userProfile,
      message: "User profile fetched successfully",
    });
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
      authType: 1,
    });

    res.status(200).json(userData);
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

export const fetchFollowers: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const userId = req.params.userId;
    const followers = await userRepository.fetchFollowing(
      userId,
      req.user._id,
      "followers"
    );

    res.status(200).json(followers);
  } catch (error) {
    next(error);
  }
};

export const fetchFollowing: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const userId = req.params.userId;
    const followers = await userRepository.fetchFollowing(
      userId,
      req.user._id,
      "following"
    );

    res.status(200).json(followers);
  } catch (error) {
    next(error);
  }
};

export const search: RequestHandler = async (req, res, next) => {
  try {
    const query = req.query.query || "";

    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    } else if (typeof query !== "string") {
      throw new HttpError(400, "Invalid query type");
    }

    const userId = req.user._id;
    const [users, posts] = await Promise.all([
      userRepository.search(userId, query),
      postRepository.search(userId, query),
      userRepository.addInterestedKeywords(userId, query),
    ]);

    res.status(200).json([...users, ...posts]);
  } catch (error) {
    next(error);
  }
};
