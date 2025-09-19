import { Otp } from "../entities/Otp";

export interface IOtpRepository {
  save(otpData: Partial<Otp>): Promise<Otp>;
  findByEmail(email: string): Promise<Otp | null>;
  delete(email: string): Promise<void>;
}
