import { RequestHandler } from "express";
import { getFollowListSchema } from "../validation/followSchemas";
import { FollowRepository } from "../../infrastructure/repositories/FollowRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { GetFollowList } from "../../application/use-cases/GetFollowList";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { isValidObjectId } from "../validation/validations";
import { ToggleFollow } from "../../application/use-cases/ToggleFollow";

export const getFollowers: RequestHandler = async (req, res, next) => {
  try {
    const { listType, ...validatedData } = getFollowListSchema.parse({
      ...req.query,
      userId: req.params.userId,
      listType: req.params.listType,
    });

    const followRepository = new FollowRepository();
    const userRepository = new UserRepository();
    const getFollowListUseCase = new GetFollowList(
      followRepository,
      userRepository
    );

    const users = await getFollowListUseCase.execute({
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
