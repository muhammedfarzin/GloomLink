import { Otp } from "../entities/Otp";

export interface IOtpRepository {
  create(otp: Otp): Promise<Otp>;
  findByEmail(email: string): Promise<Otp | null>;
  delete(email: string): Promise<boolean>;
}
