import { Router } from "express";
import * as authController from "../../controllers/auth.controller.js";
import * as userController from "../../controllers/user.controller.js";
import { authenticateToken } from "../../middleware/authenticate-token.middleware.js";
import { authorizeRole } from "../../middleware/authorize-role.middleware.js";
import { profileRouter } from "./profile.router.js";
import { postsRouter } from "./posts.router.js";

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

// Profiles

router.use("/profile", profileRouter);

// Post management

router.use("/posts", postsRouter);

// Search
router.get("/search", authenticateToken, authorizeRole("user"), userController.search);

export { router as userApiRouter };
