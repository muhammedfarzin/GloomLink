import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as postController from "../controllers/post.controller.js";
import * as userController from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/authenticate-token.middleware.js";
import { authorizeRole } from "../middleware/authorize-role.middleware.js";
import { uploadImage } from "../middleware/file-upload.middleware.js";

const router = Router();

// Authentications

router.post("/login", authController.login);
router.post("/signup", authController.signup);

router.post(
  "/signup/resend-otp",
  authenticateToken,
  authorizeRole("user"),
  authController.resendOTP
);

router.post(
  "/signup/verify-otp",
  authenticateToken,
  authorizeRole("user"),
  authController.verifyOTP
);

router.post("/auth/google", authController.signInUsingGoogle);

router.post("/auth/refresh", authController.refreshToken);

// Post management

router.get(
  "/posts",
  authenticateToken,
  authorizeRole("user"),
  postController.fetchPosts
);

router.post(
  "/posts/create",
  authenticateToken,
  authorizeRole("user"),
  uploadImage.array("images"),
  postController.createPost
);

router.get(
  "/posts/saved",
  authenticateToken,
  authorizeRole("user"),
  postController.fetchSavedPosts
);

router.put(
  "/posts/save/:postId",
  authenticateToken,
  authorizeRole("user"),
  postController.savePost
);

router.put(
  "/posts/unsave/:postId",
  authenticateToken,
  authorizeRole("user"),
  postController.unsavePost
);

// Profiles

router.get(
  "/profile",
  authenticateToken,
  authorizeRole("user"),
  userController.fetchMyProfile
);

router.get(
  "/profile/edit",
  authenticateToken,
  authorizeRole("user"),
  userController.fetchMyData
);

router.post(
  "/profile/edit",
  authenticateToken,
  authorizeRole("user"),
  uploadImage.single("image"),
  authController.updateProfile
);

router.get(
  "/profile/:username",
  authenticateToken,
  authorizeRole("user"),
  userController.fetchProfile
);

router.post(
  "/profile/follow/:userId",
  authenticateToken,
  authorizeRole("user"),
  userController.followUser
);

router.post(
  "/profile/unfollow/:userId",
  authenticateToken,
  authorizeRole("user"),
  userController.unfollowUser
);

// Report

router.post(
  "/posts/report/:postId",
  authenticateToken,
  authorizeRole("user"),
  postController.reportPost
);

export { router as userApiRouter };
