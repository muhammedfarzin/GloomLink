import { RequestHandler } from "express";
import { getLikedUsersSchema } from "../validation/likeSchemas";
import { GetLikedUsers } from "../../application/use-cases/GetLikedUsers";
import { LikeRepository } from "../../infrastructure/repositories/LikeRepository";
import { PostRepository } from "../../infrastructure/repositories/PostRepository";

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
