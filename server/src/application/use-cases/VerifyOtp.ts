import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { IPasswordHasher } from "../services/IPasswordHasher";
import { User } from "../../domain/entities/User";
import { HttpError } from "../../infrastructure/errors/HttpError";

export interface VerifyOtpInput {
  email: string;
  otp: string;
}

export class VerifyOtp {
  constructor(
    private otpRepository: IOtpRepository,
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(input: VerifyOtpInput): Promise<User> {
    const storedOtp = await this.otpRepository.findByEmail(input.email);

    if (!storedOtp) {
      throw new HttpError(
        404,
        "OTP has expired or is invalid. Please request a new one."
      );
    }

    const isMatch = await this.passwordHasher.compare(input.otp, storedOtp.otp);

    if (!isMatch) {
      throw new HttpError(400, "Invalid OTP provided.");
    }

    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new HttpError(404, "User not found.");
    }

    const updatedUser = await this.userRepository.update(user._id, {
      status: "active",
    });
    if (!updatedUser) {
      throw new HttpError(500, "Failed to activate user account.");
    }

    await this.otpRepository.delete(input.email);

    return updatedUser;
  }
}
