import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import container from "../../../shared/inversify.config";
import { TYPES } from "../../../shared/types";

import type { FollowController } from "../../controllers/follow.controller";

const router = Router();
const followController = container.get<FollowController>(
  TYPES.FollowController,
);

router.post(
  "/:userId",
  authenticateToken,
  authorizeRole("user"),
  followController.toggleFollow,
);

router.get(
  "/:userId/:listType",
  authenticateToken,
  authorizeRole("user"),
  followController.getFollowers,
);

export { router as followRouter };
