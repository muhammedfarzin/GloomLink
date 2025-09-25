import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import * as followController from "../../controllers/follow.controller";

const router = Router();

router.post(
  "/:userId",
  authenticateToken,
  authorizeRole("user"),
  followController.toggleFollow
);

router.get(
  "/:userId/:listType",
  authenticateToken,
  authorizeRole("user"),
  followController.getFollowers
);

export { router as followRouter };
