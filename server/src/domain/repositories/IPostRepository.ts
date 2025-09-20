import { Post } from "../entities/Post";

export interface IPostRepository {
  create(postData: Partial<Post>): Promise<Post>;
  findById(id: string): Promise<Post | null>;
}
