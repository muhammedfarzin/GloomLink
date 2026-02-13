import { User } from "../entities/User";

export interface IVerifyOtp {
  execute(input: VerifyOtpInput): Promise<User>;
}

export interface VerifyOtpInput {
  email: string;
  otp: string;
}
