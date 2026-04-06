import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/types";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { IPasswordHasher } from "../../domain/services/IPasswordHasher";
import type {
  ILoginUser,
  LoginInput,
  UserWithTokens,
} from "../../domain/use-cases/ILoginUser";
import {
  ForbiddenError,
  InvalidCredentialsError,
} from "../../domain/errors/AuthErrors";
import { ITokenService } from "../../domain/services/ITokenService";

@injectable()
export class LoginUser implements ILoginUser {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IPasswordHasher) private passwordHasher: IPasswordHasher,
    @inject(TYPES.ITokenService) private tokenService: ITokenService,
  ) {}

  async execute(input: LoginInput): Promise<UserWithTokens> {
    const user = await this.userRepository.findByIdentifier(input.username);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordMatch = await this.passwordHasher.compare(
      input.password,
      user.getPasswordHash(),
    );

    if (!isPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    if (user.isBlocked()) {
      throw new ForbiddenError("Your account has been blocked");
    }

    const tokens = this.tokenService.generate(
      { role: "user", id: user.getId() },
      user.isVerified(),
    );

    return { user, tokens };
  }
}
