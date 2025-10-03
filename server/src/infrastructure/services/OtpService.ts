import { inject, injectable } from "inversify";
import otpGenerator from "otp-generator";
import { IOtpService } from "../../application/services/IOtpService";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import { BcryptPasswordHasher } from "./BcryptPasswordHasher";
import { TYPES } from "../../shared/types";

@injectable()
export class OtpService implements IOtpService {
  constructor(
    @inject(TYPES.IOtpRepository) private otpRepository: IOtpRepository
  ) {}

  async generate(email: string): Promise<string> {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const passwordHasher = new BcryptPasswordHasher();
    const hashedOtp = await passwordHasher.hash(otp);

    await this.otpRepository.save({
      email,
      otp: hashedOtp,
    });

    return otp;
  }
}
