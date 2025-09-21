import type { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { CommentRepository } from "../../infrastructure/repositories/CommentRepository";
import { PostRepository } from "../../infrastructure/repositories/PostRepository";
import {
  addCommentSchema,
  getCommentsSchema,
} from "../validation/commentSchemas";
import { AddComment } from "../../application/use-cases/AddComment";
import { GetComments } from "../../application/use-cases/GetComments";

export const addComment: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const validatedBody = addCommentSchema.parse(req.body);

    const commentRepository = new CommentRepository();
    const postRepository = new PostRepository();
    const addCommentUseCase = new AddComment(commentRepository, postRepository);
    const newComment = await addCommentUseCase.execute({
      ...validatedBody,
      userId: req.user.id,
    });

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

    const commentRepository = new CommentRepository();
    const getCommentsUseCase = new GetComments(commentRepository);
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
