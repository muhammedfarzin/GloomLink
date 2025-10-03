import { injectable, inject } from "inversify";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { EnrichedPost } from "../../domain/repositories/IPostRepository";
import { TYPES } from "../../shared/types";

@injectable()
export class GetSavedPosts {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(
    userId: string,
    page: number,
    limit: number
  ): Promise<EnrichedPost[]> {
    return this.userRepository.findSavedPosts(userId, page, limit);
  }
}
