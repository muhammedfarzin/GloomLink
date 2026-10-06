import type { Comment } from "../entities/Comment";
import type { CommentResponse } from "../models/Comment";
import type { IBaseRepository } from "./IBaseRepository";

export type CommentableType = "post" | "comment";

export interface ICommentRepository extends IBaseRepository<Comment> {
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

  update(data: Comment): Promise<Comment | null>;
  deleteById(id: string): Promise<Comment | null>;
}
