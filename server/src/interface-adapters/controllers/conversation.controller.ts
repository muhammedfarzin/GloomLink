import { RequestHandler } from "express";
import { inject, injectable } from "inversify";
import { getMessagesSchema } from "../validation/followSchemas";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

import type { GetConversations } from "../../application/use-cases/GetConversations";
import type { CreateConversation } from "../../application/use-cases/CreateConversation";
import type { GetConversationId } from "../../application/use-cases/GetConversationId";
import type { GetMessages } from "../../application/use-cases/GetMessages";

import { createConversationSchema } from "../validation/conversationSchemas";

@injectable()
export class ConversationController {
  constructor(
    @inject(TYPES.CreateConversation)
    private createConversationUseCase: CreateConversation,
    @inject(TYPES.GetConversations)
    private getConversationsUseCase: GetConversations,
    @inject(TYPES.GetConversationId)
    private getConversationIdUseCase: GetConversationId,
    @inject(TYPES.GetMessages) private getMessagesUseCase: GetMessages,
  ) {}

  createConversation: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const { participants } = createConversationSchema.parse(req.body);
      const conversation = await this.createConversationUseCase.execute({
        currentUsername: req.user.username,
        participantsUsername: participants,
      });

      res.status(201).json({
        conversationId: conversation._id,
        message: "Conversation created or retrieved successfully.",
      });
    } catch (error) {
      next(error);
    }
  };

  getConversations: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const result = await this.getConversationsUseCase.execute(req.user.id);

      res
        .status(200)
        .json({ ...result, message: "Conversations fetched successfully" });
    } catch (error) {
      next(error);
    }
  };

  getConversationId: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const { username: targetUsername } = req.params;
      const conversation = await this.getConversationIdUseCase.execute({
        participantsUsername: [req.user.username, targetUsername],
      });

      res.status(200).json({
        conversationId: conversation._id,
        message: "Conversation ID fetched successfully.",
      });
    } catch (error) {
      next(error);
    }
  };

  getMessages: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const { conversationId, page, limit } = getMessagesSchema.parse({
        ...req.query,
        conversationId: req.params.conversationId,
      });

      const messages = await this.getMessagesUseCase.execute({
        conversationId,
        currentUserId: req.user.id,
        page,
        limit,
      });

      res.status(200).json({
        messagesData: messages,
        message: "Messages fetched successfully.",
      });
    } catch (error) {
      next(error);
    }
  };
}
