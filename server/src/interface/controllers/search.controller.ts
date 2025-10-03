import { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { searchSchema } from "../validation/searchSchemas";
import { SearchContent } from "../../application/use-cases/SearchContent";
import container from "../../shared/inversify.config";
import { TYPES } from "../../shared/types";

export const search: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const { q: searchQuery, ...validatedData } = searchSchema.parse(req.query);

    const searchContentUseCase = container.get<SearchContent>(
      TYPES.SearchContent
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
