import type { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { PostRepository } from "../../infrastructure/repositories/PostRepository";
import { UserModel } from "../../infrastructure/database/models/UserModel";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { LikeRepository } from "../../infrastructure/repositories/LikeRepository";
import { createPostSchema } from "../validation/postSchemas";
import { CloudinaryStorageService } from "../../infrastructure/services/CloudinaryStorageService";
import { CreatePost } from "../../application/use-cases/CreatePost";
import { GetFeedPosts } from "../../application/use-cases/GetFeedPosts";
import { FollowRepository } from "../../infrastructure/repositories/FollowRepository";
import { ToggleLikePost } from "../../application/use-cases/ToggleLikePost";
import { GetPostById } from "../../application/use-cases/GetPostById";

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

    const postRepository = new PostRepository();
    const fileStorageService = new CloudinaryStorageService();
    const createPostUseCase = new CreatePost(
      postRepository,
      fileStorageService
    );
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
    const postId = req.params.postId;
    const {
      caption,
      tags = [],
      publishedFor,
      removedImages = [],
    } = req.body as {
      caption?: string;
      tags?: string[];
      publishedFor?: string;
      removedImages?: string[];
    };

    if (
      !publishedFor ||
      (publishedFor !== "public" && publishedFor !== "subscriber")
    ) {
      throw new HttpError(400, "Please provide valid publishedFor");
    }

    const images = (req.files as Express.Multer.File[])?.map(
      (image) => image.path
    );

    const newPost = await postRepository.editPost(postId, {
      caption,
      tags,
      publishedFor,
      images,
      removedImages,
    });

    res.status(200).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const fetchSavedPosts: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 5;
    const posts = await postRepository.getSavedPost(req.user._id, {
      page,
      pageSize,
    });

    res.status(200).json({ posts, isEnd: posts.length < pageSize });
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

export const getPostById: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const currentUserId = req.user.id;
    const { postId } = req.params;

    const postRepository = new PostRepository();
    const getPostByIdUseCase = new GetPostById(postRepository);
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

    const postRepository = new PostRepository();
    const userRepository = new UserRepository();
    const followRepository = new FollowRepository();

    const getFeedPostsUseCase = new GetFeedPosts(
      postRepository,
      userRepository,
      followRepository
    );
    const postDatas = await getFeedPostsUseCase.execute({
      userId: req.user.id,
      page,
      limit,
    });

    res.status(200).json({
      postDatas,
      isEnd: postDatas.length < limit,
      message: "Posts fetched successfully",
    });
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

    if (req.user?.role === "user") {
      const post = await postRepository.findById(postId);
      if (post?.userId.toString() !== req.user._id)
        throw new HttpError(403, "You are not allowed to delete this post");
    }

    await postRepository.deletePost(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getLikedUsers: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const users = await likeRepository.getLikedUsers(postId, "post");

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const toggleLikePost: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const likeRepository = new LikeRepository();
    const postRepository = new PostRepository();
    const toggleLikeUseCase = new ToggleLikePost(
      likeRepository,
      postRepository
    );
    const result = await toggleLikeUseCase.execute({
      postId: req.params.postId,
      userId: req.user.id,
    });

    res.status(200).json({
      message: `Post successfully ${result.status}`,
    });
  } catch (error) {
    next(error);
  }
};
