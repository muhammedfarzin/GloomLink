import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import { deletePost } from "../../controllers/post.controller";
import * as adminController from "../../controllers/admin.controller";

const router = Router();

router.get(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  adminController.getPosts
);

router.patch(
  "/block/:postId",
  authenticateToken,
  authorizeRole("admin"),
  adminController.togglePostStatus
);

router.delete(
  "/:postId",
  authenticateToken,
  authorizeRole("admin"),
  deletePost
);

export { router as postsRouter };
