import { injectable } from "inversify";
import nodemailer from "nodemailer";
import { IMailService } from "@/domain/services/IMailService";
import {
  createVerificationEmailHtml,
  verificationEmailSubject,
} from "../templates/verificationEmailTemplate";
import {
  createPasswordResetEmailHtml,
  passwordResetEmailSubject,
} from "../templates/passwordResetEmailTemplate";

@injectable()
export class MailService implements IMailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async send(email: string, subject: string, body: string): Promise<void> {
    await this.transporter.sendMail({
      from: "GloomLink",
      to: email,
      subject,
      html: body,
    });
  }

  async sendVerification(
    email: string,
    verificationCode: string | number,
  ): Promise<void> {
    const body = createVerificationEmailHtml(verificationCode.toString());
    await this.send(email, verificationEmailSubject, body);
  }

  async sendPasswordReset(email: string, resetCode: string): Promise<void> {
    const body = createPasswordResetEmailHtml(resetCode);
    await this.send(email, passwordResetEmailSubject, body);
  }
}
