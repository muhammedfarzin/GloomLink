import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";

export class ToggleUserStatus {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<{ updatedStatus: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError(404, "User not found or has been removed");
    }

    const newStatus = user.status === "active" ? "blocked" : "active";
    await this.userRepository.update(userId, { status: newStatus });

    return { updatedStatus: newStatus };
  }
}
