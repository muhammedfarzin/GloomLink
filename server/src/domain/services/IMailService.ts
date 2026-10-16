export interface IMailService {
  send(email: string, subject: string, body: string): Promise<void>;
  sendVerification(email: string, verificationCode: string): Promise<void>;
  sendPasswordReset(email: string, resetCode: string): Promise<void>;
}
