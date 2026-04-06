import { Router } from "express";
import container from "../../shared/inversify.config";
import { TYPES } from "../../shared/types";
import { authenticateToken } from "../middleware/authenticate-token.middleware";
import { authorizeRole } from "../middleware/authorize-role.middleware";
import type { AuthController } from "../controllers/auth.controller";

const router = Router();

const authController = container.get<AuthController>(TYPES.AuthController);

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/google", authController.signInUsingGoogle);
router.post("/refresh", authController.refreshToken);

router.post(
  "/verify-otp",
  authenticateToken,
  authorizeRole("user"),
  authController.verifyOTP,
);

router.post(
  "/resend-otp",
  authenticateToken,
  authorizeRole("user"),
  authController.resendOTP,
);

export { router as authApiRouter };
