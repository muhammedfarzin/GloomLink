import { Router } from "express";
import { adminLogin } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/authenticate-token.middleware";
import { authorizeRole } from "../middleware/authorize-role.middleware";
import { fetchAllUsers } from "../controllers/admin.controller";

const router = Router();

router.post("/login", adminLogin);
router.get("/users", authenticateToken, authorizeRole("admin"), fetchAllUsers)

export { router as adminApiRouter };
