import {
  EnrichedPost,
  IPostRepository,
} from "../../domain/repositories/IPostRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { IFollowRepository } from "../../domain/repositories/IFollowRepository";

export interface GetFeedPostsInput {
  userId: string;
  page: number;
  limit: number;
}

export class GetFeedPosts {
  constructor(
    private postRepository: IPostRepository,
    private userRepository: IUserRepository,
    private followRepository: IFollowRepository
  ) {}

  async execute(input: GetFeedPostsInput): Promise<EnrichedPost[]> {
    const { userId } = input;

    const currentUser = await this.userRepository.findById(userId);
    if (!currentUser) {
      throw new HttpError(404, "User not found or has been removed");
    }

    const following = await this.followRepository.findFollowing(userId);
    const followingUserIds = following.map((f) => f.followingTo);

    return this.postRepository.findAndSortFeed({
      ...input,
      interestKeywords: currentUser.interestKeywords,
      followingUserIds,
    });
  }
}
