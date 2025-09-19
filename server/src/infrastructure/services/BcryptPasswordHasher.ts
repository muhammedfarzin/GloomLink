import bcrypt from "bcryptjs";
import { IPasswordHasher } from "../../application/services/IPasswordHasher";

export class BcryptPasswordHasher implements IPasswordHasher {
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
