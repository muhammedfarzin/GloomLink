import type { Model } from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "@/shared/types";
import mongoose, { PipelineStage } from "mongoose";
import type { CommentResponse } from "@/domain/models/Comment";
import type {
  ICommentRepository,
  CommentableType,
} from "@/domain/repositories/ICommentRepository";
import { Comment } from "@/domain/entities/Comment";
import type { CommentDocument } from "../database/models/CommentModel";
import { CommentMapper } from "../mappers/CommentMapper";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class CommentRepository
  extends BaseRepository<Comment, CommentDocument>
  implements ICommentRepository
{
  constructor(
    @inject(TYPES.CommentModel) protected readonly model: Model<CommentDocument>,
    @inject(TYPES.CommentMapper) protected readonly mapper: CommentMapper,
  ) {
    super();
  }

  async findByTargetId(
    targetId: string,
    type: CommentableType,
    page: number,
    limit: number,
  ): Promise<CommentResponse[]> {
    const skip = (page - 1) * limit;

    const aggregationPipeline: PipelineStage[] =
      this.createCommentAggregationPipeline([
        {
          $match: {
            targetId: new mongoose.Types.ObjectId(targetId),
            type: type,
          },
        },
        { $skip: skip },
        { $limit: limit },
      ]);

    const results = await this.model.aggregate(aggregationPipeline);
    return results.map((item) => this.mapper.toResponseDto(item));
  }

  async findByUserAndTarget(
    targetId: string,
    userId: string,
    type: CommentableType,
  ): Promise<CommentResponse[]> {
    const aggregationPipeline: PipelineStage[] =
      this.createCommentAggregationPipeline([
        {
          $match: {
            targetId: new mongoose.Types.ObjectId(targetId),
            userId: new mongoose.Types.ObjectId(userId),
            type: type,
          },
        },
      ]);
    const results = await this.model.aggregate(aggregationPipeline);
    return results.map((item) => this.mapper.toResponseDto(item));
  }

  async findOtherCommentsByTarget(
    targetId: string,
    userId: string,
    type: CommentableType,
    page: number,
    limit: number,
  ): Promise<CommentResponse[]> {
    const skip = (page - 1) * limit;
    const aggregationPipeline = this.createCommentAggregationPipeline([
      {
        $match: {
          targetId: new mongoose.Types.ObjectId(targetId),
          userId: { $ne: new mongoose.Types.ObjectId(userId) },
          type: type,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);
    const results = await this.model.aggregate(aggregationPipeline);
    return results.map((item) => this.mapper.toResponseDto(item));
  }

  async update(data: Comment) {
    const { id, comment } = this.mapper.toPersistence(data);

    const updatedComment = await this.model.findByIdAndUpdate(
      id,
      { comment },
      { new: true },
    );

    return updatedComment && this.mapper.toDomain(updatedComment);
  }

  private createCommentAggregationPipeline(
    initialMatchStage: PipelineStage[],
  ): PipelineStage[] {
    return [
      ...initialMatchStage,
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "uploadedBy",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: "$_id",
                firstname: 1,
                lastname: 1,
                username: 1,
                imageUrl: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$uploadedBy" },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "targetId",
          as: "replies",
          pipeline: [{ $match: { type: "comment" } }],
        },
      },
      { $addFields: { id: "$_id", repliesCount: { $size: "$replies" } } },
      { $project: { _id: 0, replies: 0 } },
    ];
  }
}
