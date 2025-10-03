import { injectable, inject } from "inversify";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ITokenService, Tokens } from "../services/ITokenService";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

export interface RefreshTokenInput {
  token: string;
}

@injectable()
export class RefreshToken {
  constructor(
    @inject(TYPES.ITokenService) private tokenService: ITokenService,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(input: RefreshTokenInput): Promise<Tokens> {
    const decoded = this.tokenService.verify(input.token, "refresh");

    if (decoded.role === "user") {
      const user = await this.userRepository.findById(decoded.id);
      if (!user) {
        throw new HttpError(404, "User associated with this token not found.");
      }
      if (user.status === "blocked") {
        throw new HttpError(403, "Your account is blocked.");
      }

      return this.tokenService.generate({ role: "user", id: user._id }, true);
    } else if (decoded.role === "admin") {
      return this.tokenService.generate(
        { role: "admin", id: decoded.id },
        true
      );
    }

    throw new HttpError(401, "Invalid token role.");
  }
}
