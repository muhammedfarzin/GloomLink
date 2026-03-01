import { injectable, inject } from "inversify";
import { UserNotFoundError } from "../../domain/errors/NotFoundErrors";
import { TYPES } from "../../shared/types";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { IToggleUserStatus } from "../../domain/use-cases/IToggleUserStatus";

@injectable()
export class ToggleUserStatus implements IToggleUserStatus {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    const newStatus = user.isActive() ? "blocked" : "active";
    user.updateStatus(newStatus);
    await this.userRepository.update(userId, user);

    return { updatedStatus: newStatus };
  }
}
