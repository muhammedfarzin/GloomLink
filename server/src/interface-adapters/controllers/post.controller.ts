import type { RequestHandler } from "express";
import { inject, injectable } from "inversify";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { recordInteractionSchema } from "../validation/interactionSchemas";
import { TYPES } from "../../shared/types";

import type { CreatePost } from "../../application/use-cases/CreatePost";
import type { GetPostById } from "../../application/use-cases/GetPostById";
import type { GetSavedPosts } from "../../application/use-cases/GetSavedPosts";
import type { ToggleSavePost } from "../../application/use-cases/ToggleSavePost";
import type { EditPost } from "../../application/use-cases/EditPost";
import type { DeletePost } from "../../application/use-cases/DeletePost";
import type { RecordInteraction } from "../../application/use-cases/RecordInteraction";
import type { GetRecommendedPosts } from "../../application/use-cases/GetRecommendedPosts";

import { createPostSchema, editPostSchema } from "../validation/postSchemas";

@injectable()
export class PostController {
  constructor(
    @inject(TYPES.CreatePost) private createPostUseCase: CreatePost,
    @inject(TYPES.EditPost) private editPostUseCase: EditPost,
    @inject(TYPES.GetSavedPosts) private getSavedPostsUseCase: GetSavedPosts,
    @inject(TYPES.ToggleSavePost) private toggleSavePostUseCase: ToggleSavePost,
    @inject(TYPES.GetPostById) private getPostByIdUseCase: GetPostById,
    @inject(TYPES.GetRecommendedPosts)
    private getRecommendedPostsUseCase: GetRecommendedPosts,
    @inject(TYPES.DeletePost) private deletePostUseCase: DeletePost,
    @inject(TYPES.RecordInteraction)
    private recordInteractionUseCase: RecordInteraction,
  ) {}

  createPost: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const validatedBody = createPostSchema.parse(req.body);
      const files = req.files as Express.Multer.File[];

      if (!validatedBody.caption && (!files || files.length === 0)) {
        throw new HttpError(
          400,
          "Post must have either a caption or an image.",
        );
      }

      const newPost = await this.createPostUseCase.execute({
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

  editPost: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }
      const { postId } = req.params;
      const { removedImages, ...validatedBody } = editPostSchema.parse(
        req.body,
      );
      const newFiles = (req.files as Express.Multer.File[]) || [];

      const updatedPost = await this.editPostUseCase.execute({
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

  getSavedPosts: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;

      const savedPosts = await this.getSavedPostsUseCase.execute(
        req.user.id,
        page,
        limit,
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

  toggleSavePost: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const { postId } = req.params;
      const result = await this.toggleSavePostUseCase.execute(
        req.user.id,
        postId,
      );

      if (result.status === "saved") {
        await this.recordInteractionUseCase.execute(
          req.user.id,
          postId,
          "save",
        );
      }

      res.status(200).json({ message: `Post successfully ${result.status}` });
    } catch (error) {
      next(error);
    }
  };

  getPostById: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const currentUserId = req.user.id;
      const { postId } = req.params;

      const post = await this.getPostByIdUseCase.execute({
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

  getPosts: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const postsData = await this.getRecommendedPostsUseCase.execute(
        req.user.id,
        page,
        limit,
      );

      res.status(200).json({
        postsData,
        isEnd: postsData.length < limit,
        message: "Posts fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  deletePost: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      await this.deletePostUseCase.execute({
        postId: req.params.postId,
        userId: req.user.id,
        userRole: req.user.role,
      });

      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  recordInteraction: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const validatedBody = recordInteractionSchema.parse(req.body);

      await this.recordInteractionUseCase.execute(
        req.user.id,
        validatedBody.postId,
        validatedBody.type,
      );

      res.status(200).json({ message: "Interaction recorded successfully" });
    } catch (error) {
      next(error);
    }
  };
}
