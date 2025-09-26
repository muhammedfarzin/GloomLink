import {
  IPostRepository,
  EnrichedPost,
} from "../../domain/repositories/IPostRepository";

export interface GetAdminPostsInput {
  filter: "all" | "active" | "blocked" | "reported";
  page: number;
  limit: number;
  searchQuery?: string;
  withReports?: boolean;
}

export class GetAdminPosts {
  constructor(private postRepository: IPostRepository) {}

  async execute(input: GetAdminPostsInput): Promise<EnrichedPost[]> {
    const { filter, withReports = true, ...options } = input;

    if (filter === "all") {
      return this.postRepository.findAll({ ...options, withReports });
    }

    if (filter === "reported") {
      return this.postRepository.findReported(options);
    }

    return this.postRepository.findByStatus(filter, {
      ...options,
      withReports,
    });
  }
}
