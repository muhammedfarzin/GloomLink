import {
  IPostRepository,
  EnrichedPost,
} from "../../domain/repositories/IPostRepository";

export interface GetReportedPostsInput {
  page: number;
  limit: number;
  searchQuery?: string;
}

export class GetReportedPosts {
  constructor(private postRepository: IPostRepository) {}

  async execute(input: GetReportedPostsInput): Promise<EnrichedPost[]> {
    return this.postRepository.findReported(input);
  }
}