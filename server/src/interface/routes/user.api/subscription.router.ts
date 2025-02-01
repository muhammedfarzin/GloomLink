import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import * as subscriptionController from "../../controllers/subscription.controller";

const router = Router();

router.post(
  "/enable",
  authenticateToken,
  authorizeRole("user"),
  subscriptionController.enableSubscription
);

router.get(
  "/check-eligibility",
  authenticateToken,
  authorizeRole("user"),
  subscriptionController.checkEligibility
);

export { router as subscriptionRouter };
