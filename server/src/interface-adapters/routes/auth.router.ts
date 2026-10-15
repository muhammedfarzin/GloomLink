import { Router } from "express";
import container from "@/shared/inversify.config";
import { TYPES } from "@/shared/types";
import type { AuthController } from "../controllers/auth.controller";

const router = Router();

const authController = container.get<AuthController>(TYPES.AuthController);

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/google", authController.signInUsingGoogle);
router.post("/refresh", authController.refreshToken);
router.post("/verify-otp", authController.verifyOTP);
router.post("/resend-otp", authController.resendOTP);

export { router as authApiRouter };
