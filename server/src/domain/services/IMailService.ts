export interface IMailService {
  send(email: string, subject: string, body: string): Promise<void>;
  sendVerification(
    email: string,
    verificationCode: string | number,
  ): Promise<void>;
}
