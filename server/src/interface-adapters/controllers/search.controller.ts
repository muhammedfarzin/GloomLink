import { RequestHandler } from "express";
import { inject, injectable } from "inversify";
import { HttpError } from "../errors/HttpError";
import { TYPES } from "@/shared/types";

import { ISearchContent } from "@/domain/use-cases/ISearchContent";

import { searchSchema } from "../validation/searchSchemas";
import { UserMapper } from "../mappers/UserMapper";

@injectable()
export class SearchController {
  constructor(
    @inject(TYPES.ISearchContent) private searchContentUseCase: ISearchContent,
  ) {}

  search: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const { q: searchQuery, ...validatedData } = searchSchema.parse(
        req.query,
      );

      const results = await this.searchContentUseCase.execute({
        ...validatedData,
        searchQuery,
        currentUserId: req.user.id,
      });

      const resUsers = results.users.map(UserMapper.toResponse);
      const resJson = {
        resultsData: [...resUsers, ...results.posts],
        message: "Search results fetched successfully.",
      };

      res.status(200).json(resJson);
    } catch (error) {
      next(error);
    }
  };
}
