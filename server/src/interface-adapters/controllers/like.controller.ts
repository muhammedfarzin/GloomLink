import { RequestHandler } from "express";
import { inject, injectable } from "inversify";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

import type { IGetLikedUsers } from "../../domain/use-cases/IGetLikedUsers";
import type { IToggleLike } from "../../domain/use-cases/IToggleLike";
import type { IRecordInteraction } from "../../domain/use-cases/IRecordInteraction";

import {
  getLikedUsersSchema,
  toggleLikeSchema,
} from "../validation/likeSchemas";

@injectable()
export class LikeController {
  constructor(
    @inject(TYPES.IGetLikedUsers) private getLikedUsersUseCase: IGetLikedUsers,
    @inject(TYPES.IToggleLike) private toggleLikeUseCase: IToggleLike,
    @inject(TYPES.IRecordInteraction)
    private recordInteractionUseCase: IRecordInteraction,
  ) {}

  getLikedUsers: RequestHandler = async (req, res, next) => {
    try {
      const validatedData = getLikedUsersSchema.parse({
        ...req.query,
        type: req.params.type,
        targetId: req.params.targetId,
      });

      const users = await this.getLikedUsersUseCase.execute({
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

  toggleLike: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const validatedData = toggleLikeSchema.parse(req.params);

      const result = await this.toggleLikeUseCase.execute({
        ...validatedData,
        userId: req.user.id,
      });

      if (result.status === "liked" && validatedData.type === "post") {
        await this.recordInteractionUseCase.execute({
          userId: req.user.id,
          postId: validatedData.targetId,
          type: "like",
        });
      }

      res.status(200).json({
        message: `Post successfully ${result.status}`,
      });
    } catch (error) {
      next(error);
    }
  };
}
