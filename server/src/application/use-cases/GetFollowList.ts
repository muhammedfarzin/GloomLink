import { injectable, inject } from "inversify";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";
import type { IFollowRepository } from "../../domain/repositories/IFollowRepository";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { UserListView } from "../../domain/models/User";
import type {
  IGetFollowList,
  GetFollowListInput,
} from "../../domain/use-cases/IGetFollowList";

@injectable()
export class GetFollowList implements IGetFollowList {
  constructor(
    @inject(TYPES.IFollowRepository)
    private followRepository: IFollowRepository,
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository,
  ) {}

  async execute(input: GetFollowListInput): Promise<UserListView[]> {
    const { userId, type, ...restInput } = input;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError(404, "User not found or has been removed");
    }

    return this.followRepository.findFollowList(userId, type, restInput);
  }
}
