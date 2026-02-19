import { RequestHandler } from "express";
import { inject, injectable } from "inversify";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { isValidObjectId } from "../validation/validations";
import { TYPES } from "../../shared/types";

import type { IGetAdminUsers } from "../../domain/use-cases/IGetAdminUsers";
import type { IToggleUserStatus } from "../../domain/use-cases/IToggleUserStatus";
import type { IGetAdminPosts } from "../../domain/use-cases/IGetAdminPosts";
import type { ITogglePostStatus } from "../../domain/use-cases/ITogglePostStatus";

import { getPostsSchema, getUsersSchema } from "../validation/adminSchemas";

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.IGetAdminUsers) private getAdminUsersUseCase: IGetAdminUsers,
    @inject(TYPES.IToggleUserStatus)
    private toggleUserStatusUseCase: IToggleUserStatus,
    @inject(TYPES.IGetAdminPosts) private getAdminPostsUseCase: IGetAdminPosts,
    @inject(TYPES.ITogglePostStatus)
    private togglePostStatusUseCase: ITogglePostStatus,
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
