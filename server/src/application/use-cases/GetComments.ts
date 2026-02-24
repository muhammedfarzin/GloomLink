import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/types";
import type { ICommentRepository } from "../../domain/repositories/ICommentRepository";
import type { CommentResponse } from "../../domain/models/Comment";
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

  async execute(input: GetCommentsInput): Promise<CommentResponse[]> {
    const { targetId, type, userId, page, limit } = input;

    const userComments =
      page === 1 && type !== "comment"
        ? await this.commentRepository.findByUserAndTarget(
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
