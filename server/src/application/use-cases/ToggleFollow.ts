import { injectable, inject } from "inversify";
import { IFollowRepository } from "../../domain/repositories/IFollowRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

export interface ToggleFollowInput {
  currentUserId: string;
  targetUserId: string;
}

@injectable()
export class ToggleFollow {
  constructor(
    @inject(TYPES.IFollowRepository)
    private followRepository: IFollowRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(
    input: ToggleFollowInput
  ): Promise<{ status: "followed" | "unfollowed" }> {
    const { currentUserId, targetUserId } = input;

    if (currentUserId === targetUserId) {
      throw new HttpError(400, "You cannot follow yourself.");
    }

    // ---Ensure the target user exists---
    const targetUser = await this.userRepository.findById(targetUserId);
    if (!targetUser) {
      throw new HttpError(404, "User to follow not found or has been removed");
    }

    // ---Check if the follow relationship already exists---
    const existingFollow = await this.followRepository.findByUsers(
      currentUserId,
      targetUserId
    );

    // ---Performing Action---
    if (existingFollow) {
      await this.followRepository.deleteById(existingFollow._id);
      return { status: "unfollowed" };
    } else {
      await this.followRepository.create(currentUserId, targetUserId);
      return { status: "followed" };
    }
  }
}
