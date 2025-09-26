import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import { search } from "../../controllers/search.controller";

const router = Router();

router.get("/", authenticateToken, authorizeRole("user"), search);

export { router as searchRouter };
