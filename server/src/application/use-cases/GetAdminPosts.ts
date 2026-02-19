import { injectable, inject } from "inversify";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { TYPES } from "../../shared/types";
import {
  IGetAdminPosts,
  type GetAdminPostsInput,
} from "../../domain/use-cases/IGetAdminPosts";
import type { EnrichedPost } from "../../domain/models/Post";

@injectable()
export class GetAdminPosts implements IGetAdminPosts {
  constructor(
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository,
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
