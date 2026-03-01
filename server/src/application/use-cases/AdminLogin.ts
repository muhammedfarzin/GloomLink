import { injectable, inject } from "inversify";
import { InvalidCredentialsError } from "../../domain/errors/AuthErrors";
import { TYPES } from "../../shared/types";
import {
  IAdminLogin,
  type AdminLoginInput,
} from "../../domain/use-cases/IAdminLogin";
import {
  type ITokenService,
  type TokenPayload,
  type Tokens,
} from "../../domain/services/ITokenService";

@injectable()
export class AdminLogin implements IAdminLogin {
  constructor(
    @inject(TYPES.ITokenService) private tokenService: ITokenService,
  ) {}

  async execute(input: AdminLoginInput): Promise<Tokens> {
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "password";

    if (input.username !== adminUsername || input.password !== adminPassword) {
      throw new InvalidCredentialsError();
    }

    const payload: TokenPayload = { role: "admin", id: adminUsername };
    return this.tokenService.generate(payload, true);
  }
}
