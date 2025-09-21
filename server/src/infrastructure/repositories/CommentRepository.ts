import {
  ICommentRepository,
  CommentableType,
} from "../../domain/repositories/ICommentRepository";
import { Comment } from "../../domain/entities/Comment";
import { CommentModel } from "../database/models/CommentModel";
import { CommentMapper } from "../database/mappers/CommentMapper";
import mongoose, { PipelineStage } from "mongoose";
import { CommentResponseDto } from "../../application/dtos/CommentResponseDto";

export class CommentRepository implements ICommentRepository {
  async create(commentData: {
    targetId: string;
    userId: string;
    comment: string;
    type: CommentableType;
  }): Promise<Comment> {
    const commentToPersist = CommentMapper.toPersistence(commentData);
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
    limit: number
  ): Promise<CommentResponseDto[]> {
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

  async findUserCommentsByTarget(
    targetId: string,
    userId: string,
    type: CommentableType
  ): Promise<CommentResponseDto[]> {
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
    limit: number
  ): Promise<CommentResponseDto[]> {
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
    initialMatchStage: PipelineStage[]
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
                _id: 1,
                firstname: 1,
                lastname: 1,
                username: 1,
                image: 1,
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
      { $addFields: { repliesCount: { $size: "$replies" } } },
      { $project: { replies: 0 } },
    ];
  }
}
