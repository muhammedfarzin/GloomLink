export interface ExternalAuthUser {
  email: string;
  name: string;
  uid: string;
}

export interface IExternalAuthService {
  verifyToken(token: string): Promise<ExternalAuthUser>;
}
