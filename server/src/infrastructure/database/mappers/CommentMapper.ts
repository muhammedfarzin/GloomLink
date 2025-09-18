import { Types } from "mongoose";
import { Comment } from "../../../domain/entities/Comment";
import { CommentDocument } from "../models/CommentModel";

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
}
