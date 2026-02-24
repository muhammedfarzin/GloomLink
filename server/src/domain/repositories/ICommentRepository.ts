import type { Comment } from "../entities/Comment";
import type { CommentResponse } from "../models/Comment";

export type CommentableType = "post" | "comment";

export interface ICommentRepository {
  create(comment: Comment): Promise<Comment>;

  findById(id: string): Promise<Comment | null>;

  findByTargetId(
    targetId: string,
    type: CommentableType,
    page: number,
    limit: number,
  ): Promise<CommentResponse[]>;

  findByUserAndTarget(
    targetId: string,
    userId: string,
    type: CommentableType,
  ): Promise<CommentResponse[]>;

  findOtherCommentsByTarget(
    targetId: string,
    userId: string,
    type: CommentableType,
    page: number,
    limit: number,
  ): Promise<CommentResponse[]>;
}
