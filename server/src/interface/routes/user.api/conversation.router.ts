import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import * as conversationController from "../../controllers/conversation.controller";

const router = Router();

router.get(
  "/",
  authenticateToken,
  authorizeRole("user"),
  conversationController.getConversations
);

router.post(
  "/create",
  authenticateToken,
  authorizeRole("user"),
  conversationController.createConversation
);

router.get(
  "/:username/conversationId",
  authenticateToken,
  authorizeRole("user"),
  conversationController.getConversationId
);

router.get(
  "/:conversationId",
  authenticateToken,
  authorizeRole("user"),
  conversationController.getConversationMessages
);

export { router as conversationRouter };
