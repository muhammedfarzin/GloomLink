import { Post } from "../entities/Post";

export interface ICreatePost {
  execute(input: CreatePostInput): Promise<Post>;
}

export interface CreatePostInput {
  userId: string;
  caption?: string;
  files: Express.Multer.File[];
  tags: string[];
  publishedFor?: "public" | "subscriber";
}
