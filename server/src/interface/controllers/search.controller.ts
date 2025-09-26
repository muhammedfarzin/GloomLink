import { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { searchSchema } from "../validation/searchSchemas";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { PostRepository } from "../../infrastructure/repositories/PostRepository";
import { FollowRepository } from "../../infrastructure/repositories/FollowRepository";
import { SearchContent } from "../../application/use-cases/SearchContent";

export const search: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const { q: searchQuery, ...validatedData } = searchSchema.parse(req.query);

    const userRepository = new UserRepository();
    const postRepository = new PostRepository();
    const followRepository = new FollowRepository();

    const searchContentUseCase = new SearchContent(
      userRepository,
      postRepository,
      followRepository
    );

    const results = await searchContentUseCase.execute({
      ...validatedData,
      searchQuery,
      currentUserId: req.user.id,
    });

    res.status(200).json({
      resultsData: results,
      message: "Search results fetched successfully.",
    });
  } catch (error) {
    next(error);
  }
};
