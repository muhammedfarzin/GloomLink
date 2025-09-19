export interface IOtpService {
  generate(email: string): Promise<string>;
}
