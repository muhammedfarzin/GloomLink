import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { Message } from "../../domain/entities/Message";
import { MessageModel } from "../database/models/MessageModel";
import { MessageMapper } from "../database/mappers/MessageMapper";
import mongoose, { PipelineStage } from "mongoose";

export class MessageRepository implements IMessageRepository {
  async create(messageData: Partial<Message>): Promise<Message> {
    const messageToPersist = MessageMapper.toPersistence(messageData);
    const newMessageModel = new MessageModel(messageToPersist);
    const savedDoc = await newMessageModel.save();
    return MessageMapper.toDomain(savedDoc);
  }

  async findById(messageId: string): Promise<Message | null> {
    const messageDoc = await MessageModel.findById(messageId);
    return messageDoc ? MessageMapper.toDomain(messageDoc) : null;
  }

  async update(
    messageId: string,
    data: Partial<Message>
  ): Promise<Message | null> {
    const messageToPersist = MessageMapper.toPersistence(data);
    const updatedDoc = await MessageModel.findByIdAndUpdate(
      messageId,
      { $set: messageToPersist },
      { new: true }
    );
    return updatedDoc ? MessageMapper.toDomain(updatedDoc) : null;
  }

  async findByConversationId(
    conversationId: string,
    options: { page: number; limit: number }
  ): Promise<Message[]> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const aggregationPipeline: PipelineStage[] = [
      { $match: { conversation: new mongoose.Types.ObjectId(conversationId) } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "from",
          foreignField: "_id",
          as: "fromUser",
        },
      },
      { $unwind: "$fromUser" },
      {
        $project: {
          _id: 1,
          message: 1,
          image: 1,
          from: "$fromUser.username",
          status: 1,
          type: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: 1 } },
    ];

    const messages = await MessageModel.aggregate(aggregationPipeline);
    return messages.map(MessageMapper.toDomain);
  }
}
