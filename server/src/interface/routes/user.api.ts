import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as postController from "../controllers/post.controller.js";
import * as userController from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/authenticate-token.middleware.js";
import { authorizeRole } from "../middleware/authorize-role.middleware.js";
import { uploadImage } from "../middleware/file-upload.middleware.js";

const router = Router();

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

router.post("/auth/google", authController.signInUsingGoogle)

router.post("/auth/refresh", authController.refreshToken);

router.post(
  "/posts/create",
  authenticateToken,
  authorizeRole("user"),
  uploadImage.array("images"),
  postController.createPost
);

router.get(
  "/profile",
  authenticateToken,
  authorizeRole("user"),
  userController.fetchMyProfile
);

export { router as userApiRouter };
