import { injectable } from "inversify";
import nodemailer from "nodemailer";
import { IMailService } from "../../application/services/IMailService";

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

  async send(email: string, title: string, body: string): Promise<void> {
    await this.transporter.sendMail({
      from: "GloomLink",
      to: email,
      subject: title,
      html: body,
    });
  }
}
