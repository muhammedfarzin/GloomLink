import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IPasswordHasher } from "../services/IPasswordHasher";

export interface CreateUserInput {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
}

export class CreateUser {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.checkUserExist(input);
    if (existingUser.exist) {
      throw new Error(
        `User with this ${existingUser.data.field} already exists.`
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
