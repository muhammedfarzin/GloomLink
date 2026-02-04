import { Router } from "express";
import { usersRouter } from "./users.router";
import { postsRouter } from "./posts.router";
import container from "../../../shared/inversify.config";
import { TYPES } from "../../../shared/types";

import type { AuthController } from "../../controllers/auth.controller";

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post("/login", authController.adminLogin);

router.post("/auth/refresh", authController.refreshToken);

router.use("/users", usersRouter);

router.use("/posts", postsRouter);

export { router as adminApiRouter };
