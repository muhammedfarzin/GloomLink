import { injectable, inject } from "inversify";
import { ICommentRepository } from "../../domain/repositories/ICommentRepository";
import { CommentResponseDto } from "../dtos/CommentResponseDto";
import { TYPES } from "../../shared/types";
import {
  IGetComments,
  type GetCommentsInput,
} from "../../domain/use-cases/IGetComments";

@injectable()
export class GetComments implements IGetComments {
  constructor(
    @inject(TYPES.ICommentRepository)
    private commentRepository: ICommentRepository,
  ) {}

  async execute(input: GetCommentsInput): Promise<CommentResponseDto[]> {
    const { targetId, type, userId, page, limit } = input;

    const userComments =
      page === 1 && type !== "comment"
        ? await this.commentRepository.findUserCommentsByTarget(
            targetId,
            userId,
            type,
          )
        : [];

    const otherComments = await (type !== "comment"
      ? this.commentRepository.findOtherCommentsByTarget(
          targetId,
          userId,
          type,
          page,
          limit,
        )
      : this.commentRepository.findByTargetId(targetId, type, page, limit));

    return [...userComments, ...otherComments];
  }
}
