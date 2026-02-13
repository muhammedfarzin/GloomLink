import { User } from "../entities/User";
import { ExternalAuthUser } from "../services/IExternalAuthService";

export interface ISignInWithGoogle {
  execute(input: ExternalAuthUser): Promise<User>;
}
