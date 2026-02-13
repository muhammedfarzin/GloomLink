import { Post } from "../entities/Post";

export interface IEditPost {
  execute(input: EditPostInput): Promise<Post>;
}

export interface EditPostInput {
  postId: string;
  userId: string;
  newFiles: Express.Multer.File[];
  removedFiles: string[];
  tags: string[];
  publishedFor: "public" | "subscriber";
  caption?: string | undefined;
}
