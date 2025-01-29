import type { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { commentRepository } from "../../infrastructure/repositories/CommentRepository";
import { userRepository } from "../../infrastructure/repositories/UserRepository";
import { isObjectIdOrHexString } from "mongoose";

export const addComment: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const userId = req.user._id;
    const { comment, type, targetId }: Partial<Record<string, string>> =
      req.body;

    if (!comment?.trim()) throw new HttpError(400, "Please provide a comment");
    if (type !== "post" && type !== "comment")
      throw new HttpError(400, "Please provide a valid comment type");
    if (!targetId || !isObjectIdOrHexString(targetId))
      throw new HttpError(400, "Please provide a valid targetId");

    const newComment = await commentRepository.addComment(
      targetId,
      userId,
      comment,
      type
    );
    const uploadedBy = await userRepository.findById(userId, {
      username: 1,
      firstname: 1,
      lastname: 1,
      image: 1,
    });

    res.status(201).json({
      comment: { ...newComment, uploadedBy },
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
