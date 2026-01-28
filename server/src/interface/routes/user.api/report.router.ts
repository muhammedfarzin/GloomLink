import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import container from "../../../shared/inversify.config";
import { TYPES } from "../../../shared/types";

import type { ReportController } from "../../controllers/report.controller.js";

const router = Router();
const reportController = container.get<ReportController>(
  TYPES.ReportController,
);

router.post(
  "/",
  authenticateToken,
  authorizeRole("user"),
  reportController.reportTarget,
);

export { router as reportRouter };
