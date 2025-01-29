import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import * as commentController from "../../controllers/comment.controller";

const router = Router();

router.post(
  "/add",
  authenticateToken,
  authorizeRole("user"),
  commentController.addComment
);

router.get(
  "/:targetId",
  authenticateToken,
  authorizeRole("user"),
  commentController.getComments
);

router.get(
  "/:targetId/self",
  authenticateToken,
  authorizeRole("user"),
  commentController.getMyComments
);

export { router as commentsRouter };
