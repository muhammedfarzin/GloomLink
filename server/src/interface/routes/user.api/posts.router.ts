import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import { uploadImage } from "../../middleware/file-upload.middleware";
import container from "../../../shared/inversify.config";
import { TYPES } from "../../../shared/types";

import type { PostController } from "../../controllers/post.controller";

const router = Router();
const postController = container.get<PostController>(TYPES.PostController);

router.get(
  "/",
  authenticateToken,
  authorizeRole("user"),
  postController.getPosts,
);

router.post(
  "/interaction",
  authenticateToken,
  authorizeRole("user"),
  postController.recordInteraction,
);

router.post(
  "/create",
  authenticateToken,
  authorizeRole("user"),
  uploadImage.array("images"),
  postController.createPost,
);

router.put(
  "/edit/:postId",
  authenticateToken,
  authorizeRole("user"),
  uploadImage.array("images"),
  postController.editPost,
);

router.get(
  "/saved",
  authenticateToken,
  authorizeRole("user"),
  postController.getSavedPosts,
);

router.post(
  "/save/:postId",
  authenticateToken,
  authorizeRole("user"),
  postController.toggleSavePost,
);

router.get(
  "/:postId",
  authenticateToken,
  authorizeRole("user"),
  postController.getPostById,
);

router.delete(
  "/:postId",
  authenticateToken,
  authorizeRole("user"),
  postController.deletePost,
);

export { router as postsRouter };
