import { Router } from "express";
import { adminLogin } from "../controllers/auth.controller";

const router = Router();

router.post("/login", adminLogin);

export { router as adminApiRouter };
