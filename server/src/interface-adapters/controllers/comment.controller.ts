import type { RequestHandler } from "express";
import { inject, injectable } from "inversify";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

import type { IAddComment } from "../../domain/use-cases/IAddComment";
import type { IGetComments } from "../../domain/use-cases/IGetComments";
import type { IRecordInteraction } from "../../domain/use-cases/IRecordInteraction";

import {
  addCommentSchema,
  getCommentsSchema,
} from "../validation/commentSchemas";

@injectable()
export class CommentController {
  constructor(
    @inject(TYPES.IAddComment) private addCommentUseCase: IAddComment,
    @inject(TYPES.IGetComments) private getCommentsUseCase: IGetComments,
    @inject(TYPES.IRecordInteraction)
    private recordInteractionUseCase: IRecordInteraction,
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
        await this.recordInteractionUseCase.execute({
          userId: req.user.id,
          postId: validatedBody.targetId,
          type: "comment",
        });
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
