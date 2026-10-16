export interface ResetPasswordInput {
  identifier: string;
  otp: string;
  password: string;
}

export interface IResetPassword {
  execute(input: ResetPasswordInput): Promise<void>;
}
