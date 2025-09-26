import { RequestHandler } from "express";
import { getPostsSchema } from "../validation/adminSchemas";
import { PostRepository } from "../../infrastructure/repositories/PostRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TogglePostStatus } from "../../application/use-cases/TogglePostStatus";
import { isValidObjectId } from "../validation/validations";
import { GetAdminPosts } from "../../application/use-cases/GetAdminPosts";

export const fetchAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await userRepository.findAll();

    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const blockUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const updatedUser = await userRepository.updateStatusById(
      userId,
      "blocked"
    );

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const unblockUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const updatedUser = await userRepository.updateStatusById(userId, "active");

    res.status(200).json({ user: updatedUser });
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
