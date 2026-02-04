export interface ExternalAuthUser {
  email: string;
  name: string;
  externalId: string;
}

export interface IExternalAuthService {
  verifyGoogleAuthToken(token: string): Promise<ExternalAuthUser>;
}
