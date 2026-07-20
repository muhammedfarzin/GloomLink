import { injectable } from "inversify";
import mongoose, { type PipelineStage } from "mongoose";
import type { IConversationRepository } from "@/domain/repositories/IConversationRepository";
import type { ConversationList } from "@/domain/models/Conversation";
import type { Conversation } from "@/domain/entities/Conversation";
import { ConversationModel } from "../database/models/ConversationModel";
import { ConversationMapper } from "../mappers/ConversationMapper";

@injectable()
export class ConversationRepository implements IConversationRepository {
  async create(data: Conversation): Promise<Conversation> {
    const participantIds = data.getParticipants();
    const newConversation = new ConversationModel({
      participants: participantIds,
    });
    const savedDoc = await newConversation.save();
    return ConversationMapper.toDomain({
      id: savedDoc.id.toString(),
      participants: savedDoc.participants.map((id) => id.toString()),
    });
  }

  async findById(id: string): Promise<Conversation | null> {
    const conversationDoc = await ConversationModel.findById(id);
    return conversationDoc
      ? ConversationMapper.toDomain({
          id: conversationDoc.id.toString(),
          participants: conversationDoc.participants.map((id) => id.toString()),
        })
      : null;
  }

  async findByParticipants(
    participantIds: string[],
  ): Promise<Conversation | null> {
    const conversationDoc = await ConversationModel.findOne({
      participants: {
        $all: participantIds,
        $size: participantIds.length,
      },
    });
    return conversationDoc
      ? ConversationMapper.toDomain({
          id: conversationDoc.id.toString(),
          participants: conversationDoc.participants.map((id) => id.toString()),
        })
      : null;
  }

  async findConversationsByUserId(userId: string): Promise<ConversationList[]> {
    const currentUserId = new mongoose.Types.ObjectId(userId);

    const aggregationPipeline: PipelineStage[] = [
      { $match: { participants: currentUserId } },

      // ---Get the participant's info---
      {
        $lookup: {
          from: "users",
          let: { participants: "$participants" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$_id", "$$participants"] },
                    { $ne: ["$_id", currentUserId] },
                  ],
                },
              },
            },
            {
              $project: { username: 1, firstname: 1, lastname: 1, imageUrl: 1 },
            },
          ],
          as: "otherParticipant",
        },
      },
      { $unwind: "$otherParticipant" },

      // ---Get the last message and unread count---
      {
        $lookup: {
          from: "messages",
          let: { conversationId: "$_id" },
          pipeline: [
            {
              $match: { $expr: { $eq: ["$conversation", "$$conversationId"] } },
            },
            { $sort: { createdAt: -1 } },
            {
              $group: {
                _id: null,
                lastMessageTime: { $first: "$createdAt" },
                // ---Count messages NOT sent by the current user and where status is NOT 'seen'---
                unread: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $ne: ["$from", currentUserId] },
                          { $ne: ["$status", "seen"] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
          as: "messageInfo",
        },
      },
      { $unwind: { path: "$messageInfo", preserveNullAndEmptyArrays: true } },

      // ---Project to the final shape---
      {
        $project: {
          _id: 0,
          id: "$_id",
          participantId: "$otherParticipant._id",
          username: "$otherParticipant.username",
          firstname: "$otherParticipant.firstname",
          lastname: "$otherParticipant.lastname",
          imageUrl: "$otherParticipant.imageUrl",
          unread: { $ifNull: ["$messageInfo.unread", 0] },
          lastMessageTime: "$messageInfo.lastMessageTime",
          type: "conversation",
        },
      },
      // ---Sort conversations by the most recent message---
      { $sort: { lastMessageTime: -1 } },
    ];

    const results = await ConversationModel.aggregate(aggregationPipeline);
    return results;
  }

  async update(data: Conversation) {
    const id = data.getId();
    const participantIds = data.getParticipants();
    const conversationDoc = await ConversationModel.findByIdAndUpdate(
      id,
      {
        $set: { participants: participantIds },
      },
      { new: true },
    );

    return conversationDoc && ConversationMapper.toDomain(conversationDoc);
  }

  async deleteById(id: string) {
    const conversationDoc = await ConversationModel.findByIdAndDelete(id);
    return conversationDoc && ConversationMapper.toDomain(conversationDoc);
  }
}
