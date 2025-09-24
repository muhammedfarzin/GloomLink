import {
  IPostRepository,
  EnrichedPost,
} from "../../domain/repositories/IPostRepository";

export interface GetAllPostsInput {
  page: number;
  limit: number;
  searchQuery?: string;
  withReports?: boolean;
}

export class GetAllPosts {
  constructor(private postRepository: IPostRepository) {}

  async execute(input: GetAllPostsInput): Promise<EnrichedPost[]> {
    return this.postRepository.findAll(input);
  }
}
