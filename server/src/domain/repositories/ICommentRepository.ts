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
}
