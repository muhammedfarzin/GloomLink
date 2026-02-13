import { CommentableType } from "../repositories/ICommentRepository";
import { CommentResponseDto } from "../../application/dtos/CommentResponseDto";

export interface IGetComments {
  execute(input: GetCommentsInput): Promise<CommentResponseDto[]>;
}

export interface GetCommentsInput {
  targetId: string;
  type: CommentableType;
  userId: string;
  page: number;
  limit: number;
}
