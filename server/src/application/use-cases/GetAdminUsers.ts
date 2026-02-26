import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/types";
import type { User } from "../../domain/entities/User";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type {
  IGetAdminUsers,
  GetAdminUsersInput,
} from "../../domain/use-cases/IGetAdminUsers";

@injectable()
export class GetAdminUsers implements IGetAdminUsers {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(input: GetAdminUsersInput): Promise<User[]> {
    return this.userRepository.findAll(input);
  }
}
