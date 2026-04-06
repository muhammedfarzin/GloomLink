import { Router } from "express";
import { usersRouter } from "./users.router";
import { postsRouter } from "./posts.router";
import container from "../../../shared/inversify.config";
import { TYPES } from "../../../shared/types";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";

import type { AdminController } from "../../controllers/admin.controller";

const router = Router();

const adminController = container.get<AdminController>(TYPES.AdminController);

router.get(
  "/dashboard",
  authenticateToken,
  authorizeRole("admin"),
  adminController.getDashboardData,
);

router.use("/users", usersRouter);

router.use("/posts", postsRouter);

export { router as adminApiRouter };
