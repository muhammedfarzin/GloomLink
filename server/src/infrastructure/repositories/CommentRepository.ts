import { injectable } from "inversify";
import { Comment } from "../../domain/entities/Comment";
import { CommentModel } from "../database/models/CommentModel";
import { CommentMapper } from "../mappers/CommentMapper";
import mongoose, { PipelineStage } from "mongoose";
import type { CommentResponse } from "../../domain/models/Comment";
import type {
  ICommentRepository,
  CommentableType,
} from "../../domain/repositories/ICommentRepository";

@injectable()
export class CommentRepository implements ICommentRepository {
  async create(comment: Comment): Promise<Comment> {
    const { id, createdAt, updatedAt, ...commentToPersist } =
      CommentMapper.toPersistence(comment);

    const newCommentModel = new CommentModel(commentToPersist);
    const savedComment = await newCommentModel.save();
    return CommentMapper.toDomain(savedComment);
  }

  async findById(id: string): Promise<Comment | null> {
    const commentModel = await CommentModel.findById(id);
    return commentModel ? CommentMapper.toDomain(commentModel) : null;
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
                userId: "$_id",
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
