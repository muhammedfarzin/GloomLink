import { injectable, inject } from "inversify";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { IPasswordHasher } from "../services/IPasswordHasher";
import { TYPES } from "../../shared/types";

export interface CreateUserInput {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  authType?: "email" | "google";
}

@injectable()
export class CreateUser {
  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.IPasswordHasher)
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.checkUserExist(input);
    if (existingUser.exist) {
      throw new HttpError(
        409,
        `User with this ${existingUser.field} already exists.`
      );
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);

    const userToCreate: Partial<User> = {
      ...input,
      password: hashedPassword,
      status: "not-verified",
    };

    const createdUser = await this.userRepository.create(userToCreate);

    return createdUser;
  }
}
