import type { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { postRepository } from "../../infrastructure/repositories/PostRepository";
import type { Post } from "../../infrastructure/database/models/PostModel";
import { UserModel } from "../../infrastructure/database/models/UserModel";
import { userRepository } from "../../infrastructure/repositories/UserRepository";

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

export const fetchSavedPosts: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const posts = await postRepository.getSavedPost(req.user._id);

    res.status(200).json(posts);
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

    const posts = await postRepository.getPostsForUser(req.user._id);

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const fetchPostsForAdmin: RequestHandler = async (req, res, next) => {
  try {
    const { filter, query } = req.query;
    if (
      (filter !== undefined &&
        filter !== "active" &&
        filter !== "blocked" &&
        filter !== "reported") ||
      (query && typeof query !== "string")
    )
      throw new HttpError(400, "Invalid request");

    const posts = await postRepository.getPostsForAdmin(filter, query);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const reportPost: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const postId = req.params.postId;
    const isPostExist = await postRepository.findById(postId);

    if (!isPostExist) throw new HttpError(404, "Post not found");

    await postRepository.reportPost(postId, req.user._id);

    res.status(200).json({ message: "Reported successfully" });
  } catch (error) {
    next(error);
  }
};

export const blockPost: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    await postRepository.blockPost(postId);
    res.status(200).json({ message: "Post blocked successfully" });
  } catch (error) {
    next(error);
  }
};

export const unblockPost: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    await postRepository.unblockPost(postId);
    res.status(200).json({ message: "Post unblocked successfully" });
  } catch (error) {
    next(error);
  }
};

export const deletePost: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    await postRepository.deletePost(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};
