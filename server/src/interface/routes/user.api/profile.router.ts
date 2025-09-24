import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import { uploadImage } from "../../middleware/file-upload.middleware";
import * as profileController from "../../controllers/profile.controller";
import * as authController from "../../controllers/auth.controller";

const router = Router();

router.get(
  "/edit",
  authenticateToken,
  authorizeRole("user"),
  userController.fetchMyData
);

router.put(
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
  profileController.getUserProfile
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

router.get(
  "/followers/:userId",
  authenticateToken,
  authorizeRole("user"),
  userController.fetchFollowers
);

router.get(
  "/following/:userId",
  authenticateToken,
  authorizeRole("user"),
  userController.fetchFollowing
);

export { router as profileRouter };
