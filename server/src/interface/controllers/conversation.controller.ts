import { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { GetConversations } from "../../application/use-cases/GetConversations";
import { createConversationSchema } from "../validation/conversationSchemas";
import { CreateConversation } from "../../application/use-cases/CreateConversation";
import { GetConversationId } from "../../application/use-cases/GetConversationId";
import { getMessagesSchema } from "../validation/followSchemas";
import { GetMessages } from "../../application/use-cases/GetMessages";
import container from "../../shared/inversify.config";
import { TYPES } from "../../shared/types";

export const createConversation: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const { participants } = createConversationSchema.parse(req.body);

    const createConversationUseCase = container.get<CreateConversation>(
      TYPES.CreateConversation
    );

    const conversation = await createConversationUseCase.execute({
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

export const getConversations: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const getConversationsUseCase = container.get<GetConversations>(
      TYPES.GetConversations
    );

    const result = await getConversationsUseCase.execute(req.user.id);

    res
      .status(200)
      .json({ ...result, message: "Conversations fetched successfully" });
  } catch (error) {
    next(error);
  }
};

export const getConversationId: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const { username: targetUsername } = req.params;

    const getConversationIdUseCase = container.get<GetConversationId>(
      TYPES.GetConversationId
    );
    const conversation = await getConversationIdUseCase.execute({
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

export const getMessages: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const { conversationId, page, limit } = getMessagesSchema.parse({
      ...req.query,
      conversationId: req.params.conversationId,
    });

    const getMessagesUseCase = container.get<GetMessages>(TYPES.GetMessages);
    const messages = await getMessagesUseCase.execute({
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
