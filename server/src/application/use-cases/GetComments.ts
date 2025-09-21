import {
  ICommentRepository,
  CommentableType,
} from "../../domain/repositories/ICommentRepository";
import { CommentResponseDto } from "../dtos/CommentResponseDto";

export interface GetCommentsInput {
  targetId: string;
  type: CommentableType;
  userId: string;
  page: number;
  limit: number;
}

export class GetComments {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(input: GetCommentsInput): Promise<CommentResponseDto[]> {
    const { targetId, type, userId, page, limit } = input;

    const userComments =
      page === 1 && type !== "comment"
        ? await this.commentRepository.findUserCommentsByTarget(
            targetId,
            userId,
            type
          )
        : [];

    const otherComments = await (type !== "comment"
      ? this.commentRepository.findOtherCommentsByTarget(
          targetId,
          userId,
          type,
          page,
          limit
        )
      : this.commentRepository.findByTargetId(targetId, type, page, limit));

    return [...userComments, ...otherComments];
  }
}
