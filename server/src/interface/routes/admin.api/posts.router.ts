import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import { PostController } from "../../controllers/post.controller";
import container from "../../../shared/inversify.config";
import { TYPES } from "../../../shared/types";

import type { AdminController } from "../../controllers/admin.controller";

const router = Router();
const adminController = container.get<AdminController>(TYPES.AdminController);
const postController = container.get<PostController>(TYPES.PostController);

router.get(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  adminController.getPosts,
);

router.patch(
  "/block/:postId",
  authenticateToken,
  authorizeRole("admin"),
  adminController.togglePostStatus,
);

router.delete(
  "/:postId",
  authenticateToken,
  authorizeRole("admin"),
  postController.deletePost,
);

export { router as postsRouter };
