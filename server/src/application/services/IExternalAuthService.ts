export interface ExternalAuthUser {
  email: string;
  name: string;
  uid: string;
}

export interface IExternalAuthService {
  verifyGoogleAuthToken(token: string): Promise<ExternalAuthUser>;
}
