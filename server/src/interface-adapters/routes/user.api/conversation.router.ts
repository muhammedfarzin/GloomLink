import { Router } from "express";
import { authenticateToken } from "../../middleware/authenticate-token.middleware";
import { authorizeRole } from "../../middleware/authorize-role.middleware";
import container from "../../../shared/inversify.config";
import { TYPES } from "../../../shared/types";

import type { ConversationController } from "../../controllers/conversation.controller";

const router = Router();
const conversationController = container.get<ConversationController>(
  TYPES.ConversationController,
);

router.get(
  "/",
  authenticateToken,
  authorizeRole("user"),
  conversationController.getConversations,
);

router.post(
  "/create",
  authenticateToken,
  authorizeRole("user"),
  conversationController.createConversation,
);

router.get(
  "/:username/conversationId",
  authenticateToken,
  authorizeRole("user"),
  conversationController.getConversationId,
);

router.get(
  "/:conversationId",
  authenticateToken,
  authorizeRole("user"),
  conversationController.getMessages,
);

export { router as conversationRouter };
