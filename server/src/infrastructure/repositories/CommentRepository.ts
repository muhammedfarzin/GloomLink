import { injectable } from "inversify";
import mongoose, { PipelineStage } from "mongoose";
import type { CommentResponse } from "@/domain/models/Comment";
import type {
  ICommentRepository,
  CommentableType,
} from "@/domain/repositories/ICommentRepository";
import { Comment } from "@/domain/entities/Comment";
import type { CommentDocument } from "../database/models/CommentModel";
import { CommentModel } from "../database/models/CommentModel";
import { CommentMapper } from "../mappers/CommentMapper";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class CommentRepository
  extends BaseRepository<Comment, CommentDocument>
  implements ICommentRepository
{
  protected readonly model = CommentModel;
  protected readonly mapper = CommentMapper;

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

    const results = await CommentModel.aggregate(aggregationPipeline);
    return results.map(CommentMapper.toResponseDto);
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
    const results = await CommentModel.aggregate(aggregationPipeline);
    return results.map(CommentMapper.toResponseDto);
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
    const results = await CommentModel.aggregate(aggregationPipeline);
    return results.map(CommentMapper.toResponseDto);
  }

  async update(data: Comment) {
    const { id, comment } = CommentMapper.toPersistence(data);

    const updatedComment = await CommentModel.findByIdAndUpdate(
      id,
      { comment },
      { new: true },
    );

    return updatedComment && CommentMapper.toDomain(updatedComment);
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
