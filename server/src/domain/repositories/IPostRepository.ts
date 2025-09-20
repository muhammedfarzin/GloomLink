import { Post } from "../entities/Post";

export type EnrichedPost = Post & {
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
};

export interface IPostRepository {
  create(postData: Partial<Post>): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findAndSortFeed(options: {
    userId: string;
    interestKeywords: string[];
    followingUserIds: string[];
    page: number;
    limit: number;
  }): Promise<EnrichedPost[]>;
}
