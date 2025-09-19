import otpGenerator from "otp-generator";
import { IOtpService } from "../../application/services/IOtpService";
import { OtpRepository } from "../repositories/OtpRepository";
import { BcryptPasswordHasher } from "./BcryptPasswordHasher";

export class OtpService implements IOtpService {
  constructor(private otpRepository: OtpRepository) {}

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
