import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/authenticate-token.middleware.js";
import { authorizeRole } from "../middleware/authorize-role.middleware.js";

const router = Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);

router.post("/signup/resend-otp", authenticateToken, authorizeRole("temp"), authController.resendOTP);
router.post(
  "/signup/verify-otp",
  authenticateToken,
  authorizeRole("temp"),
  authController.verifyOTP
);

export { router as userApiRouter };
