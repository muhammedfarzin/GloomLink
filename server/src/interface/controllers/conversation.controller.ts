import { RequestHandler } from "express";
import { conversationRepository } from "../../infrastructure/repositories/ConversationRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { userRepository } from "../../infrastructure/repositories/UserRepository";
import { isObjectIdOrHexString, Schema } from "mongoose";

export const createConversation: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const users: any | undefined = req.body.participants;

    if (!users || !users.length || (typeof users === "string" && !users.trim()))
      throw new HttpError(400, "Participants required");

    const userData =
      users instanceof Array
        ? await userRepository.usernameToUserId(...users)
        : await userRepository.usernameToUserId(users);

    if (!userData.length) throw new HttpError(404, "Invalid username");

    const participants = [req.user._id, ...userData];
    const conversationId = await conversationRepository.create(participants);

    res.status(201).json({ conversationId, message: "Conversation created" });
  } catch (error) {
    next(error);
  }
};

export const fetchAllConversations: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }
    const userId = req.user._id;
    const conversations = await conversationRepository.fetchConversationList(
      userId
    );

    if (conversations.length <= 10) {
      const noSuggestionUsers: Schema.Types.ObjectId[] = conversations.map(
        (conversation) => conversation._id
      );
      var suggested: any[] | undefined =
        await userRepository.fetchSuggestedUsers(userId, [
          ...noSuggestionUsers,
        ]);
    }

    res.status(200).json({ conversations, suggested });
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
    await conversationRepository.markAllMessageRead(
      conversationId,
      req.user._id
    );

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
