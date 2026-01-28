import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import container from "../../../shared/inversify.config";
import { TYPES } from "../../../shared/types";

import type { AdminController } from "../../controllers/admin.controller";

const router = Router();
const adminController = container.get<AdminController>(TYPES.AdminController);

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
