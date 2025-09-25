import type { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { PostRepository } from "../../infrastructure/repositories/PostRepository";
import { GetUserProfile } from "../../application/use-cases/GetUserProfile";
import { GetUserDataForForm } from "../../application/use-cases/GetUserDataForForm";
import { updateProfileSchema } from "../validation/profileSchemas";
import { CloudinaryStorageService } from "../../infrastructure/services/CloudinaryStorageService";
import { UpdateProfile } from "../../application/use-cases/UpdateProfile";
import { UserMapper } from "../../infrastructure/database/mappers/UserMapper";
import { BcryptPasswordHasher } from "../../infrastructure/services/BcryptPasswordHasher";
import { isValidObjectId } from "../validation/validations";
import { FollowRepository } from "../../infrastructure/repositories/FollowRepository";
import { ToggleFollow } from "../../application/use-cases/ToggleFollow";

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

export const fetchUserDataForForm: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const userRepository = new UserRepository();
    const getUserDataForEditUseCase = new GetUserDataForForm(userRepository);
    const userData = await getUserDataForEditUseCase.execute(req.user.id);

    res.status(200).json({
      userData,
      message: "User data for form fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new HttpError(401, "Unauthorized");
    }

    const validatedBody = updateProfileSchema.parse(req.body);
    const profileImageFile = req.file;

    const userRepository = new UserRepository();
    const fileStorageService = new CloudinaryStorageService();
    const passwordHasher = new BcryptPasswordHasher();
    const updateProfileUseCase = new UpdateProfile(
      userRepository,
      fileStorageService,
      passwordHasher
    );

    const updatedUser = await updateProfileUseCase.execute({
      ...validatedBody,
      userId: req.user.id,
      profileImageFile,
    });

    const userResponse = UserMapper.toAuthResponse(updatedUser);

    res.status(200).json({
      userData: userResponse,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFollow: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const { userId: targetUserId } = req.params;

    if (!isValidObjectId(targetUserId)) {
      throw new HttpError(400, "Invalid userId");
    }

    const followRepository = new FollowRepository();
    const userRepository = new UserRepository();

    const toggleFollowUseCase = new ToggleFollow(
      followRepository,
      userRepository
    );
    const result = await toggleFollowUseCase.execute({
      currentUserId: req.user.id,
      targetUserId,
    });

    res.status(200).json({
      message: `Successfully ${result.status} the user.`,
    });
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
