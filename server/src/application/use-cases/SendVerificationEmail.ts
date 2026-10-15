import { injectable, inject } from "inversify";
import { TYPES } from "@/shared/types";
import type { IOtpService } from "@/domain/services/IOtpService";
import type { IMailService } from "@/domain/services/IMailService";
import type {
  ISendVerificationEmail,
  SendVerificationEmailInput,
} from "@/domain/use-cases/ISendVerificationEmail";

@injectable()
export class SendVerificationEmail implements ISendVerificationEmail {
  constructor(
    @inject(TYPES.IOtpService) private otpService: IOtpService,
    @inject(TYPES.IMailService) private mailService: IMailService,
  ) {}

  async execute(input: SendVerificationEmailInput): Promise<void> {
    const otp = await this.otpService.generate(input.email);
    await this.mailService.sendVerification(input.email, otp);
  }
}
