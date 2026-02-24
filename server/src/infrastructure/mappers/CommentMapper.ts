import { Comment } from "../../domain/entities/Comment";
import type { CommentDocument } from "../database/models/CommentModel";
import type { CommentResponse } from "../../domain/models/Comment";
import type { CommentType } from "../../domain/models/Comment";

export class CommentMapper {
  public static toDomain(comment: CommentType | CommentDocument): Comment {
    return new Comment({
      id: comment.id.toString(),
      userId: comment.userId.toString(),
      targetId: comment.targetId.toString(),
      comment: comment.comment,
      type: comment.type,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    });
  }

  public static toPersistence(comment: Comment): CommentType {
    return {
      id: comment.getId(),
      userId: comment.getUserId(),
      targetId: comment.getTargetId(),
      comment: comment.getComment(),
      type: comment.getType(),
      createdAt: comment.getCreatedAt(),
      updatedAt: comment.getUpdatedAt(),
    };
  }

  public static toResponseDto(data: any): CommentResponse {
    return {
      id: data.id?.toString(),
      userId: data.userId.toString(),
      targetId: data.targetId.toString(),
      comment: data.comment,
      type: data.type,
      repliesCount: data.repliesCount || 0,
      uploadedBy: {
        userId: data.uploadedBy?.userId?.toString(),
        firstname: data.uploadedBy?.firstname,
        lastname: data.uploadedBy?.lastname,
        fullname: `${data.uploadedBy?.firstname} ${data.uploadedBy?.lastname}`,
        username: data.uploadedBy?.username,
        imageUrl: data.uploadedBy?.imageUrl,
      },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
