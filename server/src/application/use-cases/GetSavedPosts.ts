import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { EnrichedPost } from "../../domain/repositories/IPostRepository";

export class GetSavedPosts {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    userId: string,
    page: number,
    limit: number
  ): Promise<EnrichedPost[]> {
    return this.userRepository.findSavedPosts(userId, page, limit);
  }
}
