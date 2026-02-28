import { injectable, inject } from "inversify";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IPasswordHasher } from "../../domain/services/IPasswordHasher";
import { User } from "../../domain/entities/User";
import { HttpError } from "../../interface-adapters/errors/HttpError";
import { TYPES } from "../../shared/types";
import { ILoginUser, type LoginInput } from "../../domain/use-cases/ILoginUser";

@injectable()
export class LoginUser implements ILoginUser {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IPasswordHasher) private passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: LoginInput): Promise<User> {
    const user = await this.userRepository.findByIdentifier(input.username);

    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    const isPasswordMatch = await this.passwordHasher.compare(
      input.password,
      user.getPasswordHash(),
    );

    if (!isPasswordMatch) {
      throw new HttpError(401, "Invalid credentials");
    }

    if (user.isBlocked()) {
      throw new HttpError(403, "Your account has been blocked");
    }

    return user;
  }
}
