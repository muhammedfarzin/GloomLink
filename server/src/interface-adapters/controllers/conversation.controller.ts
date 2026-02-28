import { RequestHandler } from "express";
import { inject, injectable } from "inversify";
import { getMessagesSchema } from "../validation/followSchemas";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

import type { ICreateConversation } from "../../domain/use-cases/ICreateConversation";
import type { IGetConversations } from "../../domain/use-cases/IGetConversations";
import type { IGetConversation } from "../../domain/use-cases/IGetConversation";
import type { IGetMessages } from "../../domain/use-cases/IGetMessages";
import type { ISuggestUser } from "../../domain/use-cases/ISuggestUser";

import { createConversationSchema } from "../validation/conversationSchemas";
import { MessagePresenter } from "../presenters/MessagePresenter";

@injectable()
export class ConversationController {
  constructor(
    @inject(TYPES.ICreateConversation)
    private createConversationUseCase: ICreateConversation,
    @inject(TYPES.IGetConversations)
    private getConversationsUseCase: IGetConversations,
    @inject(TYPES.IGetConversation)
    private getConversationUseCase: IGetConversation,
    @inject(TYPES.IGetMessages) private getMessagesUseCase: IGetMessages,
    @inject(TYPES.ISuggestUser) private suggestUserUseCase: ISuggestUser,
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
        conversationId: conversation.getConversationId(),
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

      const CONVERSATION_SUGGESTION_THRESHOLD = 10;
      const userId = req.user.id;
      const conversations = await this.getConversationsUseCase.execute(userId);
      const suggestedUsers =
        conversations.length < CONVERSATION_SUGGESTION_THRESHOLD
          ? await this.suggestUserUseCase.execute({
              userId,
              excludeIds: conversations.map((c) => c.participantId),
              limit: 5,
            })
          : [];

      res.status(200).json({
        conversations,
        suggestedUsers,
        message: "Conversations fetched successfully",
      });
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
      const conversation = await this.getConversationUseCase.execute({
        participantsUsername: [req.user.username, targetUsername],
      });

      res.status(200).json({
        conversationId: conversation.getConversationId(),
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
        messagesData: messages.map(MessagePresenter.toResponse),
        message: "Messages fetched successfully.",
      });
    } catch (error) {
      next(error);
    }
  };
}
