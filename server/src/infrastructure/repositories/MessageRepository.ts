import { injectable } from "inversify";
import { IMessageRepository } from "@/domain/repositories/IMessageRepository";
import { Message } from "@/domain/entities/Message";
import type { MessageDocument } from "../database/models/MessageModel";
import { MessageModel } from "../database/models/MessageModel";
import { MessageMapper } from "../mappers/MessageMapper";
import mongoose, { PipelineStage } from "mongoose";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class MessageRepository
  extends BaseRepository<Message, MessageDocument>
  implements IMessageRepository
{
  protected readonly model = MessageModel;
  protected readonly mapper = MessageMapper;

  async update(message: Message): Promise<Message | null> {
    const { id, createdAt, updatedAt, ...messageToPersist } =
      MessageMapper.toPersistence(message);
    const updatedDoc = await MessageModel.findByIdAndUpdate(
      id,
      { $set: messageToPersist },
      { new: true },
    );
    return updatedDoc ? MessageMapper.toDomain(updatedDoc) : null;
  }

  async findByConversationId(
    conversationId: string,
    options: { page: number; limit: number },
  ): Promise<Message[]> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: { conversationId: new mongoose.Types.ObjectId(conversationId) },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
          pipeline: [{ $project: { _id: 1, username: 1 } }],
        },
      },
      { $unwind: "$sender" },
      { $sort: { createdAt: 1 } },
      {
        $addFields: {
          id: "$_id",
          senderUsername: "$sender.username",
        },
      },
    ];

    const messages = await MessageModel.aggregate(aggregationPipeline);
    return messages.map(MessageMapper.toDomain);
  }
}
