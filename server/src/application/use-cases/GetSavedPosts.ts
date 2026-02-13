import { injectable, inject } from "inversify";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { EnrichedPost } from "../../domain/repositories/IPostRepository";
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
