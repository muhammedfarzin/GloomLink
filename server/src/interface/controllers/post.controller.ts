import type { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { postRepository } from "../../infrastructure/repositories/PostRepository";
import type { Post } from "../../infrastructure/database/models/PostModel";
import { UserModel } from "../../infrastructure/database/models/UserModel";
import { userRepository } from "../../infrastructure/repositories/UserRepository";
import { commentRepository } from "../../infrastructure/repositories/CommentRepository";
import { likeRepository } from "../../infrastructure/repositories/LikeRepository";

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

    const images = (req.files as Express.Multer.File[])?.map(
      (image) => image.path
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

export const fetchPost: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const postId = req.params.postId;
    const post = await postRepository.findById(postId, null, false);

    if (!post) throw new HttpError(404, "Post not found");

    const uploadedBy = await userRepository.findById(post.userId.toString(), {
      username: 1,
      firstname: 1,
      lastname: 1,
      image: 1,
    });

    const saved = await postRepository.checkIsSaved(req.user._id, postId);
    const liked = await likeRepository.checkIsLiked(req.user._id, postId);
    const likesCount = await likeRepository.getCount(postId);
    const commentsCount = await commentRepository.getCount(postId);

    res
      .status(200)
      .json({ ...post, uploadedBy, saved, liked, likesCount, commentsCount });
  } catch (error) {
    next(error);
  }
};

export const fetchPosts: RequestHandler = async (req, res, next) => {
  try {
    let page = Number(req.query.page);
    let pageSize = Number(req.query.pageSize);

    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }
    if (isNaN(page)) page = 1;
    if (isNaN(pageSize)) pageSize = 5;

    const posts = await postRepository.getPostsForUser(req.user._id, {
      page,
    });

    res.status(200).json({ posts, isEnd: posts.length < pageSize });
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

export const likePost: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const postId = req.params.postId;
    const userId = req.user._id;

    await likeRepository.createLike(postId, userId, "post");

    res.status(200).json({ message: "Liked post successfully" });
  } catch (error) {
    next(error);
  }
};

export const dislikePost: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const postId = req.params.postId;
    const userId = req.user._id;

    await likeRepository.removeLike(postId, userId, "post");

    res.status(200).json({ message: "Disliked post successfully" });
  } catch (error) {
    next(error);
  }
};
