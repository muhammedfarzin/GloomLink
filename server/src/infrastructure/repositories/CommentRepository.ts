import { ICommentRepository, CommentableType } from '../../domain/repositories/ICommentRepository';
import { Comment } from '../../domain/entities/Comment';
import { CommentModel } from '../database/models/CommentModel';
import { CommentMapper } from '../database/mappers/CommentMapper';

export class CommentRepository implements ICommentRepository {
  async create(commentData: {
    targetId: string;
    userId: string;
    comment: string;
    type: CommentableType;
  }): Promise<Comment> {
    const commentToPersist = CommentMapper.toPersistence(commentData);
    const newCommentModel = new CommentModel(commentToPersist);
    const savedComment = await newCommentModel.save();
    return CommentMapper.toDomain(savedComment);
  }

  async findById(id: string): Promise<Comment | null> {
    const commentModel = await CommentModel.findById(id);
    return commentModel ? CommentMapper.toDomain(commentModel) : null;
  }
}