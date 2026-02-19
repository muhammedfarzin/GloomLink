import { OtpType } from "../models/Otp";

export class Otp {
  private readonly id: string;
  private readonly email: string;
  private readonly hashedOtp: string;
  private readonly createdAt: Date;

  constructor(props: OtpProps) {
    this.id = props.otpId;
    this.email = props.email;
    this.hashedOtp = props.hashedOtp;
    this.createdAt = props.createdAt ?? new Date();
  }

  // ---------------- GETTERS ----------------

  getId(): OtpType["otpId"] {
    return this.id;
  }

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
