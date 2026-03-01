import { injectable, inject } from "inversify";
import { UserNotFoundError } from "../../domain/errors/NotFoundErrors";
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
      throw new UserNotFoundError();
    }
    return user;
  }
}
