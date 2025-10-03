import { RequestHandler } from "express";
import {
  getLikedUsersSchema,
  toggleLikeSchema,
} from "../validation/likeSchemas";
import { GetLikedUsers } from "../../application/use-cases/GetLikedUsers";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { ToggleLike } from "../../application/use-cases/ToggleLike";
import container from "../../shared/inversify.config";
import { TYPES } from "../../shared/types";

export const getLikedUsers: RequestHandler = async (req, res, next) => {
  try {
    const validatedData = getLikedUsersSchema.parse({
      ...req.query,
      type: req.params.type,
      targetId: req.params.targetId,
    });

    const getLikedUsersUseCase = container.get<GetLikedUsers>(
      TYPES.GetLikedUsers
    );

    const users = await getLikedUsersUseCase.execute({
      ...validatedData,
      userId: req.user?.id,
    });

    res.status(200).json({
      usersData: users,
      message: "Liked users fetched successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const toggleLike: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const validatedData = toggleLikeSchema.parse(req.params);

    const toggleLikeUseCase = container.get<ToggleLike>(TYPES.ToggleLike);

    const result = await toggleLikeUseCase.execute({
      ...validatedData,
      userId: req.user.id,
    });

    res.status(200).json({
      message: `Post successfully ${result.status}`,
    });
  } catch (error) {
    next(error);
  }
};
