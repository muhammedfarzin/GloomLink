import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { Message } from "../../domain/entities/Message";
import { MessageModel } from "../database/models/MessageModel";
import { MessageMapper } from "../database/mappers/MessageMapper";
import mongoose, { PipelineStage } from "mongoose";

export class MessageRepository implements IMessageRepository {
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
