import { Router } from "express";
import * as authController from "../../controllers/auth.controller";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import * as adminController from "../../controllers/admin.controller";
import * as postController from "../../controllers/post.controller";
import { usersRouter } from "./users.router";
import { postsRouter } from "./posts.router";

const router = Router();

router.post("/login", authController.adminLogin);

router.post("/auth/refresh", authController.refreshToken);

router.use("/users", usersRouter);

// Post management

router.use("/posts", postsRouter)

export { router as adminApiRouter };
