export interface IMailService {
  send(email: string, title: string, body: string): Promise<void>;
}
