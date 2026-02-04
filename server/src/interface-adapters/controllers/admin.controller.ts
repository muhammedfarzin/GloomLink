import { RequestHandler } from "express";
import { inject, injectable } from "inversify";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { isValidObjectId } from "../validation/validations";
import { TYPES } from "../../shared/types";

import type { TogglePostStatus } from "../../application/use-cases/TogglePostStatus";
import type { GetAdminPosts } from "../../application/use-cases/GetAdminPosts";
import type { GetAdminUsers } from "../../application/use-cases/GetAdminUsers";
import type { ToggleUserStatus } from "../../application/use-cases/ToggleUserStatus";

import { getPostsSchema, getUsersSchema } from "../validation/adminSchemas";

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.GetAdminUsers) private getAdminUsersUseCase: GetAdminUsers,
    @inject(TYPES.ToggleUserStatus)
    private toggleUserStatusUseCase: ToggleUserStatus,
    @inject(TYPES.GetAdminPosts) private getAdminPostsUseCase: GetAdminPosts,
    @inject(TYPES.TogglePostStatus)
    private togglePostStatusUseCase: TogglePostStatus,
  ) {}

  getUsers: RequestHandler = async (req, res, next) => {
    try {
      const {
        filter,
        q: searchQuery,
        ...validatedData
      } = getUsersSchema.parse(req.query);

      const users = await this.getAdminUsersUseCase.execute({
        filter,
        searchQuery,
        ...validatedData,
      });

      res.status(200).json({
        usersData: users,
        message: "Users fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  toggleUserStatus: RequestHandler = async (req, res, next) => {
    try {
      const { userId } = req.params;

      if (!isValidObjectId(userId)) throw new HttpError(400, "Invalid userId");

      const result = await this.toggleUserStatusUseCase.execute(userId);

      res.status(200).json({
        message: `User is now ${result.updatedStatus}`,
      });
    } catch (error) {
      next(error);
    }
  };

  getPosts: RequestHandler = async (req, res, next) => {
    try {
      const {
        filter,
        q: searchQuery,
        ...validatedQuery
      } = getPostsSchema.parse(req.query);

      const posts = await this.getAdminPostsUseCase.execute({
        ...validatedQuery,
        filter,
        searchQuery,
        withReports: true,
      });

      res.status(200).json({
        postsData: posts,
        isEnd: posts.length < validatedQuery.limit,
        message: "Posts fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  togglePostStatus: RequestHandler = async (req, res, next) => {
    try {
      const { postId } = req.params;
      if (!postId) {
        throw new HttpError(400, "Post ID is required.");
      } else if (!isValidObjectId(postId)) {
        throw new HttpError(400, "Invalid Post ID.");
      }

      const result = await this.togglePostStatusUseCase.execute({ postId });

      res.status(200).json({
        message: `Post is now ${result.updatedStatus}`,
      });
    } catch (error) {
      next(error);
    }
  };
}
