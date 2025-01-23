import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import { uploadImage } from "../../middleware/file-upload.middleware";
import * as userController from "../../controllers/user.controller";
import * as authController from "../../controllers/auth.controller";

const router = Router();

router.get(
  "/",
  authenticateToken,
  authorizeRole("user"),
  userController.fetchMyProfile
);

router.get(
  "/edit",
  authenticateToken,
  authorizeRole("user"),
  userController.fetchMyData
);

router.post(
  "/edit",
  authenticateToken,
  authorizeRole("user"),
  uploadImage.single("image"),
  authController.updateProfile
);

router.get(
  "/:username",
  authenticateToken,
  authorizeRole("user"),
  userController.fetchProfile
);

router.post(
  "/follow/:userId",
  authenticateToken,
  authorizeRole("user"),
  userController.followUser
);

router.post(
  "/unfollow/:userId",
  authenticateToken,
  authorizeRole("user"),
  userController.unfollowUser
);

export { router as profileRouter };
