import type { CommentableType } from "../repositories/ICommentRepository";
import type { CommentResponse } from "../models/Comment";

export interface IGetComments {
  execute(input: GetCommentsInput): Promise<CommentResponse[]>;
}

export interface GetCommentsInput {
  targetId: string;
  type: CommentableType;
  userId: string;
  page: number;
  limit: number;
}
