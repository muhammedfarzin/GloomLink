import { EnrichedPost } from "../repositories/IPostRepository";

export interface IGetPostById {
  execute(input: GetPostByIdInput): Promise<EnrichedPost>;
}

export interface GetPostByIdInput {
  postId: string;
  userId: string;
}
