import { injectable, inject } from "inversify";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";
import { IToggleUserStatus } from "../../domain/use-cases/IToggleUserStatus";

@injectable()
export class ToggleUserStatus implements IToggleUserStatus {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError(404, "User not found or has been removed");
    }

    const newStatus = user.isActive() ? "blocked" : "active";
    user.updateStatus(newStatus);
    await this.userRepository.update(userId, user);

    return { updatedStatus: newStatus };
  }
}
