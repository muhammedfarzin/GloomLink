export interface ISendVerificationEmail {
  execute(input: SendVerificationEmailInput): Promise<void>;
}

export interface SendVerificationEmailInput {
  email: string;
}
