import type { RequestHandler } from "express";
import { inject, injectable } from "inversify";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

import type { AddComment } from "../../application/use-cases/AddComment";
import type { GetComments } from "../../application/use-cases/GetComments";
import type { RecordInteraction } from "../../application/use-cases/RecordInteraction";

import {
  addCommentSchema,
  getCommentsSchema,
} from "../validation/commentSchemas";

@injectable()
export class CommentController {
  constructor(
    @inject(TYPES.AddComment) private addCommentUseCase: AddComment,
    @inject(TYPES.GetComments) private getCommentsUseCase: GetComments,
    @inject(TYPES.RecordInteraction)
    private recordInteractionUseCase: RecordInteraction,
  ) {}

  addComment: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const validatedBody = addCommentSchema.parse(req.body);
      const newComment = await this.addCommentUseCase.execute({
        ...validatedBody,
        userId: req.user.id,
      });

      if (validatedBody.type === "post") {
        await this.recordInteractionUseCase.execute(
          req.user.id,
          validatedBody.targetId,
          "comment",
        );
      }

      res.status(201).json({
        commentData: newComment,
        message: "Comment added successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getComments: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const validatedQuery = getCommentsSchema.parse(req.query);
      const comments = await this.getCommentsUseCase.execute({
        ...validatedQuery,
        userId: req.user.id,
      });

      res.status(200).json({
        commentsData: comments,
        message: "Comments fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
