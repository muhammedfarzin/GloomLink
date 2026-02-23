import { injectable } from "inversify";
import { IInteractionRepository } from "../../domain/repositories/IInteractionRepository";
import { Interaction } from "../../domain/entities/Interaction";
import { InteractionModel } from "../database/models/InteractionModel";
import { InteractionMapper } from "../mappers/InteractionMapper";
import mongoose from "mongoose";

@injectable()
export class InteractionRepository implements IInteractionRepository {
  async create(interaction: Interaction): Promise<Interaction> {
    const { id, ...interactionToPersist } =
      InteractionMapper.toPersistence(interaction);

    const newInteraction = new InteractionModel(interactionToPersist);
    const savedInteraction = await newInteraction.save();

    // Limit to latest 100 interactions per user
    const limit = 100;
    const count = await InteractionModel.countDocuments({
      userId: interaction.getUserId(),
    });

    if (count > limit) {
      const interactionsToDelete = await InteractionModel.find({
        userId: interaction.getUserId(),
      })
        .sort({ createdAt: -1 })
        .skip(limit)
        .select("_id");

      if (interactionsToDelete.length > 0) {
        const idsToDelete = interactionsToDelete.map((doc) => doc._id);
        await InteractionModel.deleteMany({ _id: { $in: idsToDelete } });
      }
    }

    return InteractionMapper.toDomain(savedInteraction);
  }

  async findByUserId(
    userId: string,
    limit: number = 100,
  ): Promise<Interaction[]> {
    const interactions = await InteractionModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    return interactions.map(InteractionMapper.toDomain);
  }

  async getTopInteractedTags(
    userId: string,
    limit: number = 10,
  ): Promise<string[]> {
    const result = await InteractionModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "post",
        },
      },
      { $unwind: "$post" },
      { $unwind: "$post.tags" },
      {
        $group: {
          _id: { $toLower: "$post.tags" },
          totalWeight: { $sum: "$weight" },
        },
      },
      { $sort: { totalWeight: -1 } },
      { $limit: limit },
      { $project: { _id: 0, tag: "$_id" } },
    ]);

    return result.map((r) => r.tag);
  }
}
