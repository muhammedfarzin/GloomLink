import { inject, injectable } from "inversify";
import { TYPES } from "@/shared/types";
import { ValidationError } from "@/domain/errors/ValidationError";
import type { IUserRepository } from "@/domain/repositories/IUserRepository";
import type { IOtpRepository } from "@/domain/repositories/IOtpRepository";
import type { IPasswordHasher } from "@/domain/services/IPasswordHasher";
import type {
  IResetPassword,
  ResetPasswordInput,
} from "@/domain/use-cases/IResetPassword";

@injectable()
export class ResetPassword implements IResetPassword {
  constructor(
    @inject(TYPES.IUserRepository) private userRepo: IUserRepository,
    @inject(TYPES.IOtpRepository) private otpRepo: IOtpRepository,
    @inject(TYPES.IPasswordHasher) private hasher: IPasswordHasher,
  ) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    const user = await this.userRepo.findByIdentifier(input.identifier.trim());
    if (!user || !user.isActive()) {
      throw new ValidationError("Invalid or expired reset code.");
    }
    const email = user.getEmail();
    const otp = await this.otpRepo.findByEmail(email);
    if (!otp || !(await this.hasher.compare(input.otp, otp.getHashedOtp()))) {
      throw new ValidationError("Invalid or expired reset code.");
    }
    user.updatePasswordHash(await this.hasher.hash(input.password));
    const updated = await this.userRepo.update(user);
    if (!updated) throw new Error("Failed to reset password.");
    await this.otpRepo.deleteByEmail(email);
  }
}
