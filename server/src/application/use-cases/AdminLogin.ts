import { injectable, inject } from "inversify";
import { ITokenService, TokenPayload, Tokens } from "../services/ITokenService";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { AdminLoginInput } from "../../interface/validation/authSchemas";
import { TYPES } from "../../shared/types";

@injectable()
export class AdminLogin {
  constructor(
    @inject(TYPES.ITokenService) private tokenService: ITokenService
  ) {}

  async execute(input: AdminLoginInput): Promise<Tokens> {
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "password";

    if (input.username !== adminUsername || input.password !== adminPassword) {
      throw new HttpError(401, "Invalid credentials");
    }

    const payload: TokenPayload = { role: "admin", id: adminUsername };
    return this.tokenService.generate(payload, true);
  }
}
