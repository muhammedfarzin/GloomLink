import type { OtpType } from "../models/Otp";
import { BaseEntity } from "./BaseEntity";

export class Otp extends BaseEntity {
  private readonly email: string;
  private readonly hashedOtp: string;
  private readonly createdAt: Date;

  constructor(props: OtpProps) {
    super(props);
    this.email = props.email;
    this.hashedOtp = props.hashedOtp;
    this.createdAt = props.createdAt ?? new Date();
  }

  // ---------------- GETTERS ----------------

  getEmail(): OtpType["email"] {
    return this.email;
  }

  getHashedOtp(): OtpType["hashedOtp"] {
    return this.hashedOtp;
  }

  getCreatedAt(): OtpType["createdAt"] {
    return this.createdAt;
  }

  // --------- Boolean helpers ---------

  hasEmail(email: string): boolean {
    return this.email === email;
  }

  isExpired(expiresInMs: number = 5000, now: Date = new Date()): boolean {
    return now.getTime() - this.createdAt.getTime() >= expiresInMs;
  }
}

type OtpProps = Omit<OtpType, "createdAt"> & {
  createdAt?: Date;
};
