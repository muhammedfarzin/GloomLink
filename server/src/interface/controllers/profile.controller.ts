import type { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { GetUserProfile } from "../../application/use-cases/GetUserProfile";
import { GetUserDataForForm } from "../../application/use-cases/GetUserDataForForm";
import { updateProfileSchema } from "../validation/profileSchemas";
import { UpdateProfile } from "../../application/use-cases/UpdateProfile";
import { UserMapper } from "../../infrastructure/database/mappers/UserMapper";
import container from "../../shared/inversify.config";
import { TYPES } from "../../shared/types";

export const getUserProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const getUserProfileUseCase = container.get<GetUserProfile>(
      TYPES.GetUserProfile
    );

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

    const getUserDataForEditUseCase = container.get<GetUserDataForForm>(
      TYPES.GetUserDataForForm
    );

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

    const updateProfileUseCase = container.get<UpdateProfile>(
      TYPES.UpdateProfile
    );

    const updatedUser = await updateProfileUseCase.execute({
      ...validatedBody,
      userId: req.user.id,
      profileImageFile,
    });

    const userResponse = UserMapper.toResponse(updatedUser);

    res.status(200).json({
      userData: userResponse,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
