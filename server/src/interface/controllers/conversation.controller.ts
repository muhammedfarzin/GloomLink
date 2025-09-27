import { RequestHandler } from "express";
import { ConversationRepository } from "../../infrastructure/repositories/ConversationRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { isObjectIdOrHexString, Schema } from "mongoose";
import { GetConversations } from "../../application/use-cases/GetConversations";
import { createConversationSchema } from "../validation/conversationSchemas";
import { CreateConversation } from "../../application/use-cases/CreateConversation";
import { GetConversationId } from "../../application/use-cases/GetConversationId";
import { getMessagesSchema } from "../validation/followSchemas";
import { MessageRepository } from "../../infrastructure/repositories/MessageRepository";
import { GetMessages } from "../../application/use-cases/GetMessages";

export const createConversation: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const { participants } = createConversationSchema.parse(req.body);

    const conversationRepository = new ConversationRepository();
    const userRepository = new UserRepository();

    const createConversationUseCase = new CreateConversation(
      conversationRepository,
      userRepository
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

    const conversationRepository = new ConversationRepository();
    const userRepository = new UserRepository();
    const getConversationsUseCase = new GetConversations(
      conversationRepository,
      userRepository
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

    const conversationRepository = new ConversationRepository();
    const userRepository = new UserRepository();

    const getConversationIdUseCase = new GetConversationId(
      conversationRepository,
      userRepository
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

    const messageRepository = new MessageRepository();
    const conversationRepository = new ConversationRepository();

    const getMessagesUseCase = new GetMessages(
      messageRepository,
      conversationRepository
    );
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
