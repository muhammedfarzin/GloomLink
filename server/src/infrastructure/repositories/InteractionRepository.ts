import mongoose, { type Model } from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "@/shared/types";
import { Interaction } from "@/domain/entities/Interaction";
import type { InteractionDocument } from "../database/models/InteractionModel";
import { InteractionMapper } from "../mappers/InteractionMapper";
import type {
  IInteractionRepository,
  InteractionDashboardMetrics,
} from "@/domain/repositories/IInteractionRepository";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class InteractionRepository
  extends BaseRepository<Interaction, InteractionDocument>
  implements IInteractionRepository
{
  constructor(
    @inject(TYPES.InteractionModel)
    protected readonly model: Model<InteractionDocument>,
    @inject(TYPES.InteractionMapper)
    protected readonly mapper: InteractionMapper,
  ) {
    super();
  }

  async create(interaction: Interaction): Promise<Interaction> {
    const { id, ...interactionToPersist } =
      this.mapper.toPersistence(interaction);

    const newInteraction = new this.model(interactionToPersist);
    const savedInteraction = await newInteraction.save();

    // Limit to latest 100 interactions per user
    const limit = 100;
    const count = await this.model.countDocuments({
      userId: interaction.getUserId(),
    });

    if (count > limit) {
      const interactionsToDelete = await this.model
        .find({
          userId: interaction.getUserId(),
        })
        .sort({ createdAt: -1 })
        .skip(limit)
        .select("_id");

      if (interactionsToDelete.length > 0) {
        const idsToDelete = interactionsToDelete.map((doc) => doc._id);
        await this.model.deleteMany({ _id: { $in: idsToDelete } });
      }
    }

    return this.mapper.toDomain(savedInteraction);
  }

  async findByUserId(
    userId: string,
    limit: number = 100,
  ): Promise<Interaction[]> {
    const interactions = await this.model
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    return interactions.map((item) => this.mapper.toDomain(item));
  }

  async getTopInteractedTags(
    userId: string,
    limit: number = 10,
  ): Promise<string[]> {
    const result = await this.model.aggregate([
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

  async getDashboardMetrics(
    startDate: Date,
    endDate: Date,
  ): Promise<InteractionDashboardMetrics> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const matchDateRange = {
      $match: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    };

    const totalInteractions = await this.model.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    const activeUsersAggregation = await this.model.aggregate([
      matchDateRange,
      { $group: { _id: "$userId" } },
      { $count: "activeUsers" },
    ]);
    const activeUsers =
      activeUsersAggregation.length > 0
        ? activeUsersAggregation[0].activeUsers
        : 0;

    const interactionsAgg = await this.model.aggregate([
      matchDateRange,
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    const chartData = interactionsAgg.map((d) => ({
      date: d._id,
      count: d.count,
    }));

    return { totalInteractions, activeUsers, chartData };
  }

  async update(data: Interaction): Promise<Interaction | null> {
    const {
      id,
      createdAt: _createdAt,
      ...interactionToPersist
    } = this.mapper.toPersistence(data);

    const interaction = await this.model.findByIdAndUpdate(
      id,
      interactionToPersist,
      { new: true },
    );

    return interaction && this.mapper.toDomain(interaction);
  }
}
