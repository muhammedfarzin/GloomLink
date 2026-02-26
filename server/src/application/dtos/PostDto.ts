import type { PostType } from "../../domain/models/Post";

export interface PostResponseDto {
  readonly postId: string;
  readonly userId: string;
  caption?: string | null;
  images?: string[];
  tags: string[];
  publishedFor: PostType["publishedFor"];
  status: PostType["status"];
  createdAt: Date;
  updatedAt: Date;
}
