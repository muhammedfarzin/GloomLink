import { RequestHandler } from "express";
import { ConversationRepository } from "../../infrastructure/repositories/ConversationRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { isObjectIdOrHexString, Schema } from "mongoose";
import { GetConversations } from "../../application/use-cases/GetConversations";
import { createConversationSchema } from "../validation/conversationSchemas";
import { CreateConversation } from "../../application/use-cases/CreateConversation";

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

    const targetUser = await userRepository.findByUsername(req.params.username);

    if (!targetUser) throw new HttpError(404, "Invalid username");

    const conversationId = await conversationRepository.findConversationId([
      req.user._id,
      targetUser._id.toString(),
    ]);

    if (!conversationId) throw new HttpError(404, "Conversation not found");

    // const messages = await conversationRepository.fetchMessages(conversationId);

    res.status(200).json({ conversationId });
  } catch (error) {
    next(error);
  }
};

export const getConversationMessages: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    if (!isObjectIdOrHexString(req.params.conversationId))
      throw new HttpError(400, "Invalid conversation");

    const conversationId =
      await conversationRepository.validateConversationPermission(
        req.user._id,
        req.params.conversationId
      );

    if (!conversationId)
      throw new HttpError(403, "You are not included in this conversation");

    const messages = await conversationRepository.fetchMessages(conversationId);

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
