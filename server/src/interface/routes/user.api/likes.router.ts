import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import * as likeController from "../../controllers/like.controller.js";

const router = Router();

router.get(
  "/:type/:targetId",
  authenticateToken,
  authorizeRole("user"),
  likeController.getLikedUsers
);

router.post(
  "/:type/:targetId",
  authenticateToken,
  authorizeRole("user"),
  likeController.toggleLike
);

export { router as likesRouter };
