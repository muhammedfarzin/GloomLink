import { injectable, inject } from "inversify";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";
import { IFetchUser } from "../../domain/use-cases/IFetchUser";

@injectable()
export class FetchUser implements IFetchUser {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isVerified()) {
      throw new HttpError(404, "User not found or has been removed");
    }
    return user;
  }
}
