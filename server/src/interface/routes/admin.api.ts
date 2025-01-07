import { Router } from "express";
import { adminLogin } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/authenticate-token.middleware";
import { authorizeRole } from "../middleware/authorize-role.middleware";
import * as adminController from "../controllers/admin.controller";

const router = Router();

router.post("/login", adminLogin);

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

export { router as adminApiRouter };
