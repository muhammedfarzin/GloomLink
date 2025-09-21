import { CommentResponseDto } from "../../application/dtos/CommentResponseDto";
import { Comment } from "../entities/Comment";

export type CommentableType = "post" | "comment";

export interface ICommentRepository {
  create(commentData: {
    targetId: string;
    userId: string;
    comment: string;
    type: CommentableType;
  }): Promise<Comment>;

  findById(id: string): Promise<Comment | null>;

  findByTargetId(
    targetId: string,
    type: CommentableType,
    page: number,
    limit: number
  ): Promise<CommentResponseDto[]>;

  findUserCommentsByTarget(
    targetId: string,
    userId: string,
    type: CommentableType
  ): Promise<CommentResponseDto[]>;

  findOtherCommentsByTarget(
    targetId: string,
    userId: string,
    type: CommentableType,
    page: number,
    limit: number
  ): Promise<CommentResponseDto[]>;
}
