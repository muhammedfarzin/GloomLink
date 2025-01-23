import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import * as postController from "../../controllers/post.controller";

const router = Router();

router.get(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  postController.fetchPostsForAdmin
);

router.put(
  "/block/:postId",
  authenticateToken,
  authorizeRole("admin"),
  postController.blockPost
);

router.put(
  "/unblock/:postId",
  authenticateToken,
  authorizeRole("admin"),
  postController.unblockPost
);

router.delete(
  "/:postId",
  authenticateToken,
  authorizeRole("admin"),
  postController.deletePost
);

export { router as postsRouter };
