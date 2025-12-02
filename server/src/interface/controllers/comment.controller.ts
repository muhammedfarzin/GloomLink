import type { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import {
  addCommentSchema,
  getCommentsSchema,
} from "../validation/commentSchemas";
import { AddComment } from "../../application/use-cases/AddComment";
import { GetComments } from "../../application/use-cases/GetComments";
import container from "../../shared/inversify.config";
import { TYPES } from "../../shared/types";
import { RecordInteraction } from "../../application/use-cases/RecordInteraction";

export const addComment: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const validatedBody = addCommentSchema.parse(req.body);

    const addCommentUseCase = container.get<AddComment>(TYPES.AddComment);
    const newComment = await addCommentUseCase.execute({
      ...validatedBody,
      userId: req.user.id,
    });

    if (validatedBody.type === "post") {
      const recordInteractionUseCase = container.get<RecordInteraction>(
        TYPES.RecordInteraction
      );

      await recordInteractionUseCase.execute(
        req.user.id,
        validatedBody.targetId,
        "comment"
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

export const getComments: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const validatedQuery = getCommentsSchema.parse(req.query);

    const getCommentsUseCase = container.get<GetComments>(TYPES.GetComments);
    const comments = await getCommentsUseCase.execute({
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
