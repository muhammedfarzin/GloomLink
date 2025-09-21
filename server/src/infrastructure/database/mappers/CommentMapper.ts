import { Types } from "mongoose";
import { Comment } from "../../../domain/entities/Comment";
import { CommentDocument } from "../models/CommentModel";
import { CommentResponseDto } from "../../../application/dtos/CommentResponseDto";

export class CommentMapper {
  public static toDomain(commentModel: CommentDocument): Comment {
    const commentObject = commentModel.toObject<CommentDocument>();

    return {
      ...commentObject,
      _id: commentObject._id.toString(),
      targetId: commentObject.targetId.toString(),
      userId: commentObject.userId.toString(),
    };
  }

  public static toPersistence(comment: Partial<Comment>): any {
    const persistenceComment: any = { ...comment };

    if (comment._id) {
      persistenceComment._id = new Types.ObjectId(comment._id);
    }
    if (comment.targetId) {
      persistenceComment.targetId = new Types.ObjectId(comment.targetId);
    }
    if (comment.userId) {
      persistenceComment.userId = new Types.ObjectId(comment.userId);
    }

    return persistenceComment;
  }

  public static toResponseDto(data: any): CommentResponseDto {
    return {
      _id: data._id?.toString(),
      targetId: data.targetId?.toString(),
      userId: data.userId?.toString(),
      comment: data.comment,
      type: data.type,
      repliesCount: data.repliesCount || 0,
      uploadedBy: {
        _id: data.uploadedBy?._id?.toString(),
        firstname: data.uploadedBy?.firstname,
        lastname: data.uploadedBy?.lastname,
        username: data.uploadedBy?.username,
        image: data.uploadedBy?.image,
      },
    };
  }
}
