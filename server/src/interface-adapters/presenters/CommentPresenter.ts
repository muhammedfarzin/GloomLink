import type { CommentResponseDto } from "../../application/dtos/CommentDto";
import type { Comment } from "../../domain/entities/Comment";

export class CommentPresenter {
  public static toResponse(comment: Comment): CommentResponseDto {
    return {
      id: comment.getId(),
      targetId: comment.getTargetId(),
      userId: comment.getUserId(),
      comment: comment.getComment(),
      type: comment.getType(),
      createdAt: comment.getCreatedAt(),
      updatedAt: comment.getUpdatedAt(),
    };
  }
}
