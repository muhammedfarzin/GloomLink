import type { Socket } from "socket.io";
import {
  type Conversation,
  ConversationModel,
} from "../database/models/ConversationModel";
import { type Message, MessageModel } from "../database/models/MessageModel";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import type {
  RootFilterQuery,
  ProjectionType,
  ObjectId,
  Schema,
} from "mongoose";
import { Types } from "mongoose";
import { userRepository } from "./UserRepository";

class ConversationRepository implements IConversationRepository {
  async create(participants: (string | ObjectId)[]) {
    const existConversationId = await this.findConversationId(
      participants.map((userId) => userId.toString())
    );

    if (existConversationId) return existConversationId;

    const conversation = new ConversationModel({ participants });
    const newConversation = await conversation.save();
    return newConversation._id;
  }

  async findOne(
    filter?: RootFilterQuery<Conversation> | undefined,
    projection?: ProjectionType<Conversation> | null | undefined
  ) {
    const result = await ConversationModel.findOne(filter, projection);
    return result;
  }

  async findConversationId(
    participants: (string | Types.ObjectId | Schema.Types.ObjectId)[]
  ) {
    const conversation = await conversationRepository.findOne({
      participants: { $all: participants },
      $expr: { $eq: [{ $size: "$participants" }, 2] },
    });

    return conversation?._id;
  }

  async findConversationIdByUsername(...username: string[]) {
    const userIds = await userRepository.usernameToUserId(...username);
    const conversationId = await this.findConversationId(userIds);
    return conversationId;
  }

  async fetchAllCoversations(userId: string) {
    const conversations = await ConversationModel.find({
      participants: userId,
    });

    return conversations;
  }

  async fetchConversationList(userId: string) {
    const conversations = await ConversationModel.aggregate([
      {
        $match: {
          participants: Types.ObjectId.createFromHexString(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          as: "userData",
          let: { participants: "$participants" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$_id", "$$participants"] },
                    {
                      $ne: ["$_id", Types.ObjectId.createFromHexString(userId)],
                    },
                  ],
                },
              },
            },
            { $project: { firstname: 1, lastname: 1, username: 1, image: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "conversation",
          as: "messages",
          pipeline: [
            {
              $facet: {
                unread: [
                  {
                    $match: {
                      status: "sent",
                      from: { $ne: Types.ObjectId.createFromHexString(userId) },
                    },
                  },
                ],
                lastMessage: [{ $sort: { createdAt: -1 } }, { $limit: 1 }],
              },
            },
            {
              $project: {
                unread: 1,
                lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
              },
            },
          ],
        },
      },
      { $unwind: "$messages" },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              { $arrayElemAt: ["$userData", 0] },
              { unread: { $size: "$messages.unread" } },
              {
                lastMessageTime: "$messages.lastMessage.createdAt",
              },
            ],
          },
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);

    return conversations;
  }

  async addMessage(
    conversation: Types.ObjectId,
    from: string,
    data: Partial<Pick<Message, "message" | "image">> & Pick<Message, "type">
  ) {
    const message = new MessageModel({ conversation, from, ...data });
    const newMessage = await message.save();
    return newMessage.toObject();
  }

  async validateConversationPermission(userId: string, conversationId: string) {
    const conversation = await ConversationModel.findOne({
      _id: Types.ObjectId.createFromHexString(conversationId),
      participants: Types.ObjectId.createFromHexString(userId),
    });
    return conversation?._id || false;
  }

  async fetchMessages(conversation: Types.ObjectId) {
    const messages = await MessageModel.find(
      { conversation },
      { conversation: 0 }
    ).sort("createdAt");

    const fromUserIds = messages.map((message) => message.from);
    const fromUsername = await userRepository.userIdToUsername(...fromUserIds);

    return messages.map((message) => ({
      ...message.toObject(),
      from: fromUsername[message.from.toString()],
    }));
  }

  async markAsRead(messageId: string | Types.ObjectId, userId: string) {
    const message = await MessageModel.findById(messageId);
    if (!message) return;

    const conversation = await ConversationModel.findById(message.conversation);
    const hasPermission = !!conversation?.participants.find(
      (user) => user.toString() === userId
    );

    if (!hasPermission) return;

    await message.updateOne({ status: "seen" });
  }
}

export const conversationRepository = new ConversationRepository();
