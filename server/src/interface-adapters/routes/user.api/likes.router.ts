import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import container from "../../../shared/inversify.config";
import { TYPES } from "../../../shared/types";

import type { LikeController } from "../../controllers/like.controller";

const router = Router();
const likeController = container.get<LikeController>(TYPES.LikeController);

router.get(
  "/:type/:targetId",
  authenticateToken,
  authorizeRole("user"),
  likeController.getLikedUsers,
);

router.post(
  "/:type/:targetId",
  authenticateToken,
  authorizeRole("user"),
  likeController.toggleLike,
);

export { router as likesRouter };
