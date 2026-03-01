import { injectable, inject } from "inversify";
import { Follow } from "../../domain/entities/Follow";
import { ValidationError } from "../../domain/errors/ValidationError";
import { UserNotFoundError } from "../../domain/errors/NotFoundErrors";
import { TYPES } from "../../shared/types";
import type { IFollowRepository } from "../../domain/repositories/IFollowRepository";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type {
  IToggleFollow,
  ToggleFollowInput,
  ToggleFollowResponse,
} from "../../domain/use-cases/IToggleFollow";

@injectable()
export class ToggleFollow implements IToggleFollow {
  constructor(
    @inject(TYPES.IFollowRepository)
    private followRepository: IFollowRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(input: ToggleFollowInput): Promise<ToggleFollowResponse> {
    const { currentUserId, targetUserId } = input;

    if (currentUserId === targetUserId) {
      throw new ValidationError("You cannot follow yourself.");
    }

    // ---Ensure the target user exists---
    const targetUser = await this.userRepository.findById(targetUserId);
    if (!targetUser) {
      throw new UserNotFoundError();
    }

    // ---Check if the follow relationship already exists---
    const existingFollow = await this.followRepository.find(
      currentUserId,
      targetUserId,
    );

    // ---Performing Action---
    if (existingFollow) {
      await this.followRepository.deleteById(existingFollow.getId());
      return { status: "unfollowed" };
    } else {
      const followToCreate = new Follow({
        id: crypto.randomUUID(),
        followedBy: currentUserId,
        followingTo: targetUserId,
      });

      await this.followRepository.create(followToCreate);
      return { status: "followed" };
    }
  }
}
