import type { EnrichedPost } from "../models/Post";

export interface IGetPostById {
  execute(input: GetPostByIdInput): Promise<EnrichedPost>;
}

export interface GetPostByIdInput {
  postId: string;
  userId: string;
}
