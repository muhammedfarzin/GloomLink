import { injectable, inject } from "inversify";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IPasswordHasher } from "../services/IPasswordHasher";
import { User } from "../../domain/entities/User";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { LoginInput } from "../../interface/validation/authSchemas";
import { TYPES } from "../../shared/types";

@injectable()
export class LoginUser {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IPasswordHasher) private passwordHasher: IPasswordHasher
  ) {}

  async execute(input: LoginInput): Promise<User> {
    const user = await this.userRepository.findByIdentifier(input.username);

    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    const isPasswordMatch = await this.passwordHasher.compare(
      input.password,
      user.password
    );

    if (!isPasswordMatch) {
      throw new HttpError(401, "Invalid credentials");
    }

    if (user.status === "blocked") {
      throw new HttpError(403, "Your account has been blocked");
    }

    return user;
  }
}
