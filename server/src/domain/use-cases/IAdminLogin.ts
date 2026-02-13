import { Tokens } from "../services/ITokenService";

export interface IAdminLogin {
  execute(input: AdminLoginInput): Promise<Tokens>;
}

export interface AdminLoginInput {
  username: string;
  password: string;
}
