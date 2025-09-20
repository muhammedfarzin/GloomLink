import type { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { CommentRepository } from "../../infrastructure/repositories/CommentRepository";
import { PostRepository } from "../../infrastructure/repositories/PostRepository";
import { addCommentSchema } from "../validation/commentSchemas";
import { AddComment } from "../../application/use-cases/AddComment";

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
    const targetId = req.params.targetId;
    const type = req.query.type;
    const userId = req.user?.role === "user" ? req.user._id : undefined;

    if (type !== "post" && type !== "comment")
      throw new HttpError(400, "Invalid comment type");

    const comments = await commentRepository.getComments(
      targetId,
      type,
      userId
    );

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const getMyComments: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const targetId = req.params.targetId;
    const type = req.query.type;
    const userId = req.user._id;

    if (type !== "post" && type !== "comment")
      throw new HttpError(400, "Invalid comment type");

    const comments = await commentRepository.getComments(
      targetId,
      type,
      userId,
      true
    );

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
