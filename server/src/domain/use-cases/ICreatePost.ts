import type { Post } from "../entities/Post";
import type { PostType } from "../models/Post";

export interface ICreatePost {
  execute(input: CreatePostInput): Promise<Post>;
}

export interface CreatePostInput {
  userId: string;
  caption?: string;
  files: Express.Multer.File[];
  tags: string[];
  publishedFor?: PostType["publishedFor"];
  status?: PostType["status"];
}
