import { ILikeRepository } from '../../domain/repositories/ILikeRepository';
import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { HttpError } from '../../infrastructure/errors/HttpError';

export interface ToggleLikePostInput {
  postId: string;
  userId: string;
}

export interface ToggleLikePostOutput {
  status: 'liked' | 'unliked';
}

export class ToggleLikePost {
  constructor(
    private likeRepository: ILikeRepository,
    private postRepository: IPostRepository
  ) {}

  async execute(input: ToggleLikePostInput): Promise<ToggleLikePostOutput> {
    const { postId, userId } = input;

    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new HttpError(404, 'Post not found');
    }

    const existingLike = await this.likeRepository.findByTargetAndUser(postId, userId, 'post');

    if (existingLike) {
      await this.likeRepository.delete(existingLike._id);
      return { status: 'unliked' };
    } else {
      await this.likeRepository.create({
        targetId: postId,
        userId: userId,
        type: 'post',
      });
      return { status: 'liked' };
    }
  }
}