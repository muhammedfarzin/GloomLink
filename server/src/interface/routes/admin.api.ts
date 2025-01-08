import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/authenticate-token.middleware";
import { authorizeRole } from "../middleware/authorize-role.middleware";
import * as adminController from "../controllers/admin.controller";

const router = Router();

router.post("/login", authController.adminLogin);

router.get(
  "/users",
  authenticateToken,
  authorizeRole("admin"),
  adminController.fetchAllUsers
);

router.put(
  "/users/:userId/block",
  authenticateToken,
  authorizeRole("admin"),
  adminController.blockUser
);

router.put(
  "/users/:userId/unblock",
  authenticateToken,
  authorizeRole("admin"),
  adminController.unblockUser
);

router.post("/auth/refresh", authController.refreshToken);

export { router as adminApiRouter };
