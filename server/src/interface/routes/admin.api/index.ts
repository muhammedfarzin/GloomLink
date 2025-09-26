import { Router } from "express";
import * as authController from "../../controllers/auth.controller";
import { usersRouter } from "./users.router";
import { postsRouter } from "./posts.router";

const router = Router();

router.post("/login", authController.adminLogin);

router.post("/auth/refresh", authController.refreshToken);

router.use("/users", usersRouter);

router.use("/posts", postsRouter);

export { router as adminApiRouter };
