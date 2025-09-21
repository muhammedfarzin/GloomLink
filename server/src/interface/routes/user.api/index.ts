import { Router } from "express";
import * as authController from "../../controllers/auth.controller.js";
import * as userController from "../../controllers/user.controller.js";
import { authenticateToken } from "../../middleware/authenticate-token.middleware.js";
import { authorizeRole } from "../../middleware/authorize-role.middleware.js";
import { profileRouter } from "./profile.router.js";
import { postsRouter } from "./posts.router.js";
import { commentsRouter } from "./comments.router.js";
import { subscriptionRouter } from "./subscription.router.js";
import { conversationRouter } from "./conversation.router.js";

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

// Search
router.get("/search", authenticateToken, authorizeRole("user"), userController.search);

// Profiles

router.use("/profile", profileRouter);

// Post management

router.use("/posts", postsRouter);

// Comments

router.use("/comments", commentsRouter);

// Subscriptions

router.use("/subscriptions", subscriptionRouter);

// Conversations

router.use("/conversations", conversationRouter);

export { router as userApiRouter };
