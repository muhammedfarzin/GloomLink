import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import * as postController from "../../controllers/post.controller";
import { uploadImage } from "../../middleware/file-upload.middleware";

const router = Router();

router.get(
  "/",
  authenticateToken,
  authorizeRole("user"),
  postController.fetchPosts
);

router.post(
  "/create",
  authenticateToken,
  authorizeRole("user"),
  uploadImage.array("images"),
  postController.createPost
);

router.get(
  "/saved",
  authenticateToken,
  authorizeRole("user"),
  postController.fetchSavedPosts
);

router.put(
  "/save/:postId",
  authenticateToken,
  authorizeRole("user"),
  postController.savePost
);

router.put(
  "/unsave/:postId",
  authenticateToken,
  authorizeRole("user"),
  postController.unsavePost
);

router.put(
  "/like/:postId",
  authenticateToken,
  authorizeRole("user"),
  postController.likePost
);

router.put(
  "/dislike/:postId",
  authenticateToken,
  authorizeRole("user"),
  postController.dislikePost
);

router.get(
  "/:postId",
  authenticateToken,
  authorizeRole("user"),
  postController.fetchPost
);

// Comments

router.get(
  "/:postId/comments",
  authenticateToken,
  authorizeRole("user"),
  postController.getComments
);

router.get(
  "/:postId/mycomments",
  authenticateToken,
  authorizeRole("user"),
  postController.getMyComments
);

router.post(
  "/:postId/comment",
  authenticateToken,
  authorizeRole("user"),
  postController.addComment
);

router.get(
  "/:postId/likes",
  authenticateToken,
  authorizeRole("user"),
  postController.getLikedUsers
);

router.delete(
  "/:postId",
  authenticateToken,
  authorizeRole("user"),
  postController.deletePost
);

// Report

router.post(
  "/report/:postId",
  authenticateToken,
  authorizeRole("user"),
  postController.reportPost
);

export { router as postsRouter };
