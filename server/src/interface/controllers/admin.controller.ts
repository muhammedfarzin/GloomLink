import { RequestHandler } from "express";
import { getPostsSchema } from "../validation/adminSchemas";
import { PostRepository } from "../../infrastructure/repositories/PostRepository";
import { GetAllPosts } from "../../application/use-cases/GetAllPosts";
import { GetPostsByStatus } from "../../application/use-cases/GetPostsByStatus";
import { EnrichedPost } from "../../domain/repositories/IPostRepository";
import { GetReportedPosts } from "../../application/use-cases/GetReportedPosts";

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
    let posts: EnrichedPost[];

    if (filter === "all") {
      const getAllPostsUseCase = new GetAllPosts(postRepository);
      posts = await getAllPostsUseCase.execute({
        ...validatedQuery,
        searchQuery,
        withReports: true,
      });
    } else if (filter === "reported") {
      const getReportedPostsUseCase = new GetReportedPosts(postRepository);
      posts = await getReportedPostsUseCase.execute({
        ...validatedQuery,
        searchQuery,
      });
    } else {
      const GetPostsByStatusUseCase = new GetPostsByStatus(postRepository);
      posts = await GetPostsByStatusUseCase.execute({
        ...validatedQuery,
        status: filter,
        searchQuery,
        withReports: true,
      });
    }

    res.status(200).json({
      postsData: posts,
      isEnd: posts.length < validatedQuery.limit,
      message: "All posts fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
