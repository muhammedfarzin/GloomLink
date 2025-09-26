import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import * as adminController from "../../controllers/admin.controller";

const router = Router();

router.get(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  adminController.getUsers
);

router.patch(
  "/:userId/status",
  authenticateToken,
  authorizeRole("admin"),
  adminController.toggleUserStatus
);

export { router as usersRouter };
