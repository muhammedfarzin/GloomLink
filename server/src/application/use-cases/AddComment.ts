import {
  ICommentRepository,
  CommentableType,
} from "../../domain/repositories/ICommentRepository";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { Comment } from "../../domain/entities/Comment";
import { HttpError } from "../../infrastructure/errors/HttpError";

export interface AddCommentInput {
  targetId: string;
  userId: string;
  comment: string;
  type: CommentableType;
}

export class AddComment {
  constructor(
    private commentRepository: ICommentRepository,
    private postRepository: IPostRepository
  ) {}

  async execute(input: AddCommentInput): Promise<Comment> {
    const { targetId, userId, comment, type } = input;

    if (type === "post") {
      const post = await this.postRepository.findById(targetId);
      if (!post) {
        throw new HttpError(404, "Post to comment on not found.");
      }
    } else if (type === "comment") {
      const parentComment = await this.commentRepository.findById(targetId);
      if (!parentComment) {
        throw new HttpError(404, "Comment to reply to not found.");
      }
    }

    const newComment = await this.commentRepository.create({
      targetId,
      userId,
      comment,
      type,
    });

    return newComment;
  }
}
