import { Post } from "../entities/Post";

export type EnrichedPost = Post & {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  uploadedBy: {
    _id: string;
    username: string;
    firstname: string;
    lastname: string;
    image?: string;
  };
};

export interface IPostRepository {
  create(postData: Partial<Post>): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findEnrichedById(
    postId: string,
    userId: string
  ): Promise<EnrichedPost | null>;
  findAndSortFeed(options: {
    userId: string;
    interestKeywords: string[];
    followingUserIds: string[];
    page: number;
    limit: number;
  }): Promise<EnrichedPost[]>;
}
