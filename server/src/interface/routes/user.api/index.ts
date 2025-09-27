import { Router } from "express";
import * as authController from "../../controllers/auth.controller.js";
import * as reportController from "../../controllers/report.controller.js";
import { authenticateToken } from "../../middleware/authenticate-token.middleware.js";
import { authorizeRole } from "../../middleware/authorize-role.middleware.js";
import { profileRouter } from "./profile.router.js";
import { postsRouter } from "./posts.router.js";
import { commentsRouter } from "./comments.router.js";
import { conversationRouter } from "./conversation.router.js";
import { likesRouter } from "./likes.router.js";
import { searchRouter } from "./search.router.js";

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

router.post(
  "/report",
  authenticateToken,
  authorizeRole("user"),
  reportController.reportTarget
);

router.use("/search", searchRouter);

router.use("/profile", profileRouter);

router.use("/posts", postsRouter);

router.use("/likes", likesRouter);

router.use("/comments", commentsRouter);

router.use("/conversations", conversationRouter);

export { router as userApiRouter };
