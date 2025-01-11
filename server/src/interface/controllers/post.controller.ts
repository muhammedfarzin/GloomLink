import type { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { postRepository } from "../../infrastructure/repositories/PostRepository";
import type { Post } from "../../infrastructure/database/models/PostModel";

export const createPost: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const { caption, tags, publishedFor } = req.body as {
      caption?: string;
      tags: string[];
      publishedFor: Post["publishedFor"];
    };
    const images = (req.files as Express.Multer.File[])?.map((file) =>
      file.path.replace("public", "")
    );

    const post = await postRepository.createPost({
      caption,
      images,
      publishedFor,
      tags,
      userId: req.user._id,
    });

    res.status(201).json({ post, message: "Post created successfully" });
  } catch (error) {
    next(error);
  }
};
