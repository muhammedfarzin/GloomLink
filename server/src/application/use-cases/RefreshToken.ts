import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/types";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type {
  ITokenService,
  Tokens,
} from "../../domain/services/ITokenService";
import type {
  IRefreshToken,
  RefreshTokenInput,
} from "../../domain/use-cases/IRefreshToken";
import {
  ForbiddenError,
  UnauthorizedError,
} from "../../domain/errors/AuthErrors";

@injectable()
export class RefreshToken implements IRefreshToken {
  constructor(
    @inject(TYPES.ITokenService) private tokenService: ITokenService,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(input: RefreshTokenInput): Promise<Tokens> {
    const decoded = this.tokenService.verify(input.token, "refresh");

    if (decoded.role === "user") {
      const user = await this.userRepository.findById(decoded.id);
      if (!user) {
        throw new UnauthorizedError(
          "User associated with this token not found",
        );
      }
      if (user.isBlocked()) {
        throw new ForbiddenError("Your account is blocked");
      }

      return this.tokenService.generate(
        { role: "user", id: user.getId() },
        true,
      );
    } else if (decoded.role === "admin") {
      return this.tokenService.generate(
        { role: "admin", id: decoded.id },
        true,
      );
    }

    throw new UnauthorizedError("Invalid token role");
  }
}
