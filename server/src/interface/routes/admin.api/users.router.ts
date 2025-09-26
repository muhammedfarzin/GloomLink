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

router.put(
  "/:userId/block",
  authenticateToken,
  authorizeRole("admin"),
  adminController.blockUser
);

router.put(
  "/:userId/unblock",
  authenticateToken,
  authorizeRole("admin"),
  adminController.unblockUser
);

export { router as usersRouter };
