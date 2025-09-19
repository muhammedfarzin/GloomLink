import { IOtpService } from "../services/IOtpService";
import { IMailService } from "../services/IMailService";

export interface SendVerificationEmailInput {
  email: string;
}

export class SendVerificationEmail {
  constructor(
    private otpService: IOtpService,
    private mailService: IMailService
  ) {}

  async execute(input: SendVerificationEmailInput): Promise<void> {
    const otp = await this.otpService.generate(input.email);

    const emailTitle = "GloomLink Verification Email";
    const emailBody = `<h1>Please confirm your Email</h1><p>Here is your OTP code: ${otp}</p>`;

    await this.mailService.send(input.email, emailTitle, emailBody);
  }
}
