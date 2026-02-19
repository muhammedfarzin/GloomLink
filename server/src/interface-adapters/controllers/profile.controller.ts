import type { RequestHandler } from "express";
import { inject, injectable } from "inversify";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { UserMapper } from "../../infrastructure/mappers/UserMapper";
import { TYPES } from "../../shared/types";

import type { IGetUserProfile } from "../../domain/use-cases/IGetUserProfile";
import type { IFetchUser } from "../../domain/use-cases/IFetchUser";
import type { IUpdateProfile } from "../../domain/use-cases/IUpdateProfile";

import { updateProfileSchema } from "../validation/profileSchemas";

@injectable()
export class ProfileController {
  constructor(
    @inject(TYPES.IGetUserProfile)
    private getUserProfileUseCase: IGetUserProfile,
    @inject(TYPES.IFetchUser)
    private fetchUserUseCase: IFetchUser,
    @inject(TYPES.IUpdateProfile) private updateProfileUseCase: IUpdateProfile,
  ) {}

  getUserProfile: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const userProfile = await this.getUserProfileUseCase.execute({
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

  fetchUserDataForForm: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const user = await this.fetchUserUseCase.execute(req.user.id);
      const userResponseDto = UserMapper.toResponseWithAuthType(user);

      res.status(200).json({
        userData: userResponseDto,
        message: "User data for form fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const validatedBody = updateProfileSchema.parse(req.body);
      const profileImageFile = req.file;

      const updatedUser = await this.updateProfileUseCase.execute({
        ...validatedBody,
        userId: req.user.id,
        profileImageFile,
      });

      const userResponse = UserMapper.toResponseWithStatus(updatedUser);

      res.status(200).json({
        userData: userResponse,
        message: "Profile updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
