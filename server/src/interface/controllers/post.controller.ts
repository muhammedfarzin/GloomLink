import type { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { postRepository } from "../../infrastructure/repositories/PostRepository";
import type { Post } from "../../infrastructure/database/models/PostModel";
import { UserModel } from "../../infrastructure/database/models/UserModel";

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

export const savePost: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const postId = req.params.postId;

    await UserModel.updateOne(
      { _id: req.user._id },
      { $push: { savedPosts: postId } }
    );

    res.status(200).json({ postId, message: "Post saved successfully" });
  } catch (error) {
    next(error);
  }
};

export const unsavePost: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const postId = req.params.postId;

    await UserModel.updateOne(
      { _id: req.user._id },
      { $pull: { savedPosts: postId } }
    );

    res.status(200).json({ postId, message: "Post saved successfully" });
  } catch (error) {
    next(error);
  }
};

export const fetchPosts: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const posts = await postRepository.getPosts(req.user._id);

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
