import { injectable, inject } from "inversify";
import { User } from "@/domain/entities/User";
import { UserNotFoundError } from "@/domain/errors/NotFoundErrors";
import { FormValidationError } from "@/domain/errors/FormValidationError";
import { TYPES } from "@/shared/types";
import type { IUserRepository } from "@/domain/repositories/IUserRepository";
import type { IOtpRepository } from "@/domain/repositories/IOtpRepository";
import type { IPasswordHasher } from "@/domain/services/IPasswordHasher";
import type { IVerifyOtp, VerifyOtpInput } from "@/domain/use-cases/IVerifyOtp";

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
      throw new FormValidationError({ otp: "OTP has expired or is invalid." });
    }

    const isMatch = await this.passwordHasher.compare(
      input.otp,
      storedOtp.getHashedOtp(),
    );

    if (!isMatch) {
      throw new FormValidationError({ otp: "Invalid OTP." });
    }

    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new UserNotFoundError();
    }

    user.updateStatus("active");
    const updatedUser = await this.userRepository.update(user);
    if (!updatedUser) {
      throw new Error("Failed to activate user account.");
    }

    await this.otpRepository.deleteByEmail(input.email);

    return updatedUser;
  }
}
