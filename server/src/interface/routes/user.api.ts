import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/authenticate-token.middleware.js";
import { authorizeRole } from "../middleware/authorize-role.middleware.js";

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

router.post("/auth/refresh", authController.refreshToken);

export { router as userApiRouter };
