import { RequestHandler } from "express";
import {
  getLikedUsersSchema,
  toggleLikeSchema,
} from "../validation/likeSchemas";
import { GetLikedUsers } from "../../application/use-cases/GetLikedUsers";
import { LikeRepository } from "../../infrastructure/repositories/LikeRepository";
import { PostRepository } from "../../infrastructure/repositories/PostRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { ToggleLike } from "../../application/use-cases/ToggleLike";

export const getLikedUsers: RequestHandler = async (req, res, next) => {
  try {
    const validatedData = getLikedUsersSchema.parse({
      ...req.query,
      type: req.params.type,
      targetId: req.params.targetId,
    });
    const likeRepository = new LikeRepository();
    const targetRepository = new PostRepository();

    const getLikedUsersUseCase = new GetLikedUsers(
      likeRepository,
      targetRepository
    );
    const users = await getLikedUsersUseCase.execute(validatedData);

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

    const likeRepository = new LikeRepository();
    const targetRepository = new PostRepository();
    const toggleLikeUseCase = new ToggleLike(likeRepository, targetRepository);
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
