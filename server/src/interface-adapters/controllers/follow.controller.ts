import { RequestHandler } from "express";
import { inject, injectable } from "inversify";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { isValidObjectId } from "../validation/validations";
import { TYPES } from "../../shared/types";

import type { GetFollowList } from "../../application/use-cases/GetFollowList";
import type { ToggleFollow } from "../../application/use-cases/ToggleFollow";

import { getFollowListSchema } from "../validation/followSchemas";

@injectable()
export class FollowController {
  constructor(
    @inject(TYPES.GetFollowList) private getFollowListUseCase: GetFollowList,
    @inject(TYPES.ToggleFollow) private toggleFollowUseCase: ToggleFollow,
  ) {}

  getFollowers: RequestHandler = async (req, res, next) => {
    try {
      const { listType, ...validatedData } = getFollowListSchema.parse({
        ...req.query,
        userId: req.params.userId,
        listType: req.params.listType,
      });

      const users = await this.getFollowListUseCase.execute({
        ...validatedData,
        currentUserId: req.user?.id,
        type: listType,
      });

      res.status(200).json({
        usersData: users,
        message: `${listType} list fetched successfully.`,
      });
    } catch (error) {
      next(error);
    }
  };

  toggleFollow: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const { userId: targetUserId } = req.params;

      if (!isValidObjectId(targetUserId)) {
        throw new HttpError(400, "Invalid userId");
      }

      const result = await this.toggleFollowUseCase.execute({
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
}
