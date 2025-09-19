import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ITokenService, Tokens } from "../services/ITokenService";
import { HttpError } from "../../infrastructure/errors/HttpError";

export interface RefreshTokenInput {
  token: string;
}

export class RefreshToken {
  constructor(
    private tokenService: ITokenService,
    private userRepository: IUserRepository
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
