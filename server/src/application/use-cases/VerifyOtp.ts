import { injectable, inject } from "inversify";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { IPasswordHasher } from "../../domain/services/IPasswordHasher";
import { User } from "../../domain/entities/User";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";
import {
  IVerifyOtp,
  type VerifyOtpInput,
} from "../../domain/use-cases/IVerifyOtp";

@injectable()
export class VerifyOtp implements IVerifyOtp {
  constructor(
    @inject(TYPES.IOtpRepository) private otpRepository: IOtpRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IPasswordHasher) private passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: VerifyOtpInput): Promise<User> {
    const storedOtp = await this.otpRepository.findByEmail(input.email);

    if (!storedOtp) {
      throw new HttpError(
        404,
        "OTP has expired or is invalid. Please request a new one.",
      );
    }

    const isMatch = await this.passwordHasher.compare(
      input.otp,
      storedOtp.getHashedOtp(),
    );

    if (!isMatch) {
      throw new HttpError(400, "Invalid OTP provided.");
    }

    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new HttpError(404, "User not found.");
    }

    user.updateStatus("active");
    const updatedUser = await this.userRepository.update(user.getId(), user);
    if (!updatedUser) {
      throw new HttpError(500, "Failed to activate user account.");
    }

    await this.otpRepository.delete(input.email);

    return updatedUser;
  }
}
