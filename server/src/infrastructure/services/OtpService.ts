import { inject, injectable } from "inversify";
import otpGenerator from "otp-generator";
import { TYPES } from "../../shared/types";
import { Otp } from "../../domain/entities/Otp";

import type { IOtpRepository } from "../../domain/repositories/IOtpRepository";
import type { IOtpService } from "../../domain/services/IOtpService";
import type { IPasswordHasher } from "../../domain/services/IPasswordHasher";

@injectable()
export class OtpService implements IOtpService {
  constructor(
    @inject(TYPES.IOtpRepository) private otpRepository: IOtpRepository,
    @inject(TYPES.IPasswordHasher) private passwordHasher: IPasswordHasher,
  ) {}

  async generate(email: string): Promise<string> {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const hashedOtp = await this.passwordHasher.hash(otp);
    const otpToCreate = new Otp({
      otpId: crypto.randomUUID(),
      email,
      hashedOtp,
    });

    await this.otpRepository.create(otpToCreate);

    return otp;
  }
}
