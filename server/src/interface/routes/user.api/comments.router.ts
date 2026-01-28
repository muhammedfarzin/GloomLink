import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import container from "../../../shared/inversify.config";
import { CommentController } from "../../controllers/comment.controller";
import { TYPES } from "../../../shared/types";

const router = Router();
const commentController = container.get<CommentController>(
  TYPES.CommentController,
);

router.post(
  "/add",
  authenticateToken,
  authorizeRole("user"),
  commentController.addComment,
);

router.get(
  "/",
  authenticateToken,
  authorizeRole("user"),
  commentController.getComments,
);

export { router as commentsRouter };
