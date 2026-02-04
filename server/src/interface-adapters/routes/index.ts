import { Router } from "express";
import { userApiRouter } from "./user.api";
import { adminApiRouter } from "./admin.api";
import errorMiddleware from "../middleware/error.middleware";

const router = Router();

router.use("/api/user", userApiRouter);
router.use("/api/admin", adminApiRouter);

router.use("/api", errorMiddleware);

router.all("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Route not found",
  });
});

export default router;
