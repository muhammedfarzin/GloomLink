import { injectable, inject } from "inversify";
import {
  IPostRepository,
  EnrichedPost,
} from "../../domain/repositories/IPostRepository";
import { TYPES } from "../../shared/types";

export interface GetAdminPostsInput {
  filter: "all" | "active" | "blocked" | "reported";
  page: number;
  limit: number;
  searchQuery?: string;
  withReports?: boolean;
}

@injectable()
export class GetAdminPosts {
  constructor(
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository
  ) {}

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
