import { Router } from "express";
import { userApiRouter } from "./user.api.js";
import { adminApiRouter } from "./admin.api.js";
import errorMiddleware from "../middleware/error.middleware.js";

const router = Router();

router.use("/api/user", userApiRouter);
router.use("/api/admin", adminApiRouter);

router.use("/api", errorMiddleware);

router.all("*", (_, res) => {
  res.status(404).json({
    status: 404,
    message: "Route not found",
  });
});

export default router;
