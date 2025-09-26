import { RequestHandler } from "express";
import { getPostsSchema, getUsersSchema } from "../validation/adminSchemas";
import { PostRepository } from "../../infrastructure/repositories/PostRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TogglePostStatus } from "../../application/use-cases/TogglePostStatus";
import { isValidObjectId } from "../validation/validations";
import { GetAdminPosts } from "../../application/use-cases/GetAdminPosts";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { GetAdminUsers } from "../../application/use-cases/GetAdminUsers";
import { ToggleUserStatus } from "../../application/use-cases/ToggleUserStatus";

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const {
      filter,
      q: searchQuery,
      ...validatedData
    } = getUsersSchema.parse(req.query);

    const userRepository = new UserRepository();
    const getAdminUsersUseCase = new GetAdminUsers(userRepository);
    const users = await getAdminUsersUseCase.execute({
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

export const toggleUserStatus: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) throw new HttpError(400, "Invalid userId");

    const userRepository = new UserRepository();
    const toggleUserStatusUseCase = new ToggleUserStatus(userRepository);
    const result = await toggleUserStatusUseCase.execute(userId);

    res.status(200).json({
      message: `User is now ${result.updatedStatus}`,
    });
  } catch (error) {
    next(error);
  }
};

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const {
      filter,
      q: searchQuery,
      ...validatedQuery
    } = getPostsSchema.parse(req.query);

    const postRepository = new PostRepository();
    const getAdminPostsUseCase = new GetAdminPosts(postRepository);
    const posts = await getAdminPostsUseCase.execute({
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

export const togglePostStatus: RequestHandler = async (req, res, next) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new HttpError(400, "Post ID is required.");
    } else if (!isValidObjectId(postId)) {
      throw new HttpError(400, "Invalid Post ID.");
    }

    const postRepository = new PostRepository();
    const togglePostStatusUseCase = new TogglePostStatus(postRepository);
    const result = await togglePostStatusUseCase.execute({ postId });

    res.status(200).json({
      message: `Post is now ${result.updatedStatus}`,
    });
  } catch (error) {
    next(error);
  }
};
