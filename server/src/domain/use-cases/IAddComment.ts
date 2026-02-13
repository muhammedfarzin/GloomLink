import { Comment } from "../entities/Comment";
import { CommentableType } from "../repositories/ICommentRepository";

export interface IAddComment {
  execute(input: AddCommentInput): Promise<Comment>;
}

export interface AddCommentInput {
  targetId: string;
  userId: string;
  comment: string;
  type: CommentableType;
}
