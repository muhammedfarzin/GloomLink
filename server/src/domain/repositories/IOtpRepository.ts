import type { Otp } from "../entities/Otp";
import type { IRepository } from "./IRepository";

export interface IOtpRepository extends IRepository {
  create(otp: Otp): Promise<Otp>;
  findById(id: string): Promise<Otp | null>;
  findByEmail(email: string): Promise<Otp | null>;
  update(data: Otp): Promise<Otp | null>;
  deleteById(id: string): Promise<Otp | null>;
  deleteByEmail(email: string): Promise<boolean>;
}
