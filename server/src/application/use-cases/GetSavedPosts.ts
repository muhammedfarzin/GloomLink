import { injectable, inject } from "inversify";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { EnrichedPost } from "../../domain/models/Post";
import { TYPES } from "../../shared/types";
import {
  IGetSavedPosts,
  type GetSavedPostsInput,
} from "../../domain/use-cases/IGetSavedPosts";

@injectable()
export class GetSavedPosts implements IGetSavedPosts {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(input: GetSavedPostsInput): Promise<EnrichedPost[]> {
    return this.userRepository.findSavedPosts(
      input.userId,
      input.page,
      input.limit,
    );
  }
}
