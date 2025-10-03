import type { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { createPostSchema, editPostSchema } from "../validation/postSchemas";
import { CreatePost } from "../../application/use-cases/CreatePost";
import { GetFeedPosts } from "../../application/use-cases/GetFeedPosts";
import { GetPostById } from "../../application/use-cases/GetPostById";
import { GetSavedPosts } from "../../application/use-cases/GetSavedPosts";
import { ToggleSavePost } from "../../application/use-cases/ToggleSavePost";
import { EditPost } from "../../application/use-cases/EditPost";
import { DeletePost } from "../../application/use-cases/DeletePost";
import container from "../../shared/inversify.config";
import { TYPES } from "../../shared/types";

export const createPost: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const validatedBody = createPostSchema.parse(req.body);
    const files = req.files as Express.Multer.File[];

    if (!validatedBody.caption && (!files || files.length === 0)) {
      throw new HttpError(400, "Post must have either a caption or an image.");
    }

    const createPostUseCase = container.get<CreatePost>(TYPES.CreatePost);

    const newPost = await createPostUseCase.execute({
      userId: req.user.id,
      caption: validatedBody.caption,
      tags: validatedBody.tags,
      publishedFor: validatedBody.publishedFor,
      files: files || [],
    });

    res.status(201).json({
      postData: newPost,
      message: "Post created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const editPost: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }
    const { postId } = req.params;
    const { removedImages, ...validatedBody } = editPostSchema.parse(req.body);
    const newFiles = (req.files as Express.Multer.File[]) || [];

    const editPostUseCase = container.get<EditPost>(TYPES.EditPost);

    const updatedPost = await editPostUseCase.execute({
      ...validatedBody,
      removedFiles: removedImages,
      newFiles,
      postId,
      userId: req.user.id,
    });

    res
      .status(200)
      .json({ postData: updatedPost, message: "Post updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const getSavedPosts: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const getSavedPostsUseCase = container.get<GetSavedPosts>(
      TYPES.GetSavedPosts
    );

    const savedPosts = await getSavedPostsUseCase.execute(
      req.user.id,
      page,
      limit
    );

    res.status(200).json({
      postsData: savedPosts,
      isEnd: savedPosts.length < limit,
      message: "Saved posts fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const toggleSavePost: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const { postId } = req.params;

    const toggleSavePostUseCase = container.get<ToggleSavePost>(
      TYPES.ToggleSavePost
    );

    const result = await toggleSavePostUseCase.execute(req.user.id, postId);

    res.status(200).json({ message: `Post successfully ${result.status}` });
  } catch (error) {
    next(error);
  }
};

export const getPostById: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const currentUserId = req.user.id;
    const { postId } = req.params;

    const getPostByIdUseCase = container.get<GetPostById>(TYPES.GetPostById);

    const post = await getPostByIdUseCase.execute({
      postId: postId,
      userId: currentUserId,
    });

    res.status(200).json({
      postData: post,
      message: "Post fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const getFeedPostsUseCase = container.get<GetFeedPosts>(TYPES.GetFeedPosts);

    const postsData = await getFeedPostsUseCase.execute({
      userId: req.user.id,
      page,
      limit,
    });

    res.status(200).json({
      postsData,
      isEnd: postsData.length < limit,
      message: "Posts fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new HttpError(401, "Unauthorized");
    }

    const deletePostUseCase = container.get<DeletePost>(TYPES.DeletePost);

    await deletePostUseCase.execute({
      postId: req.params.postId,
      userId: req.user.id,
      userRole: req.user.role,
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};
