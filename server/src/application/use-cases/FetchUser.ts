import { injectable, inject } from "inversify";
import { HttpError } from "../../interface-adapters/errors/HttpError";
import { TYPES } from "../../shared/types";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type {
  FetchUserOptions,
  IFetchUser,
} from "../../domain/use-cases/IFetchUser";

@injectable()
export class FetchUser implements IFetchUser {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(userId: string, options?: FetchUserOptions) {
    const user = await this.userRepository.findById(userId);
    if (!user || (!options?.allowNotVerified && !user.isVerified())) {
      throw new HttpError(404, "User not found or has been removed");
    }
    return user;
  }
}
