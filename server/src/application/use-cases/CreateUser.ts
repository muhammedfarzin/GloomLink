import { injectable, inject } from "inversify";
import { User } from "../../domain/entities/User";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { IPasswordHasher } from "../../domain/services/IPasswordHasher";
import type {
  CreateUserInput,
  ICreateUser,
} from "../../domain/use-cases/ICreateUser";

@injectable()
export class CreateUser implements ICreateUser {
  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.IPasswordHasher)
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.checkUserExist(input);
    if (existingUser.isExists) {
      throw new HttpError(
        409,
        `User with this ${existingUser.field} already exists.`,
      );
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);
    const userToCreate: User = new User({
      ...input,
      userId: crypto.randomUUID(),
      passwordHash: hashedPassword,
      status: "not-verified",
    });

    const createdUser = await this.userRepository.create(userToCreate);

    return createdUser;
  }
}
