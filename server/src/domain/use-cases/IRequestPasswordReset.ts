export interface IRequestPasswordReset {
  execute(input: { identifier: string }): Promise<void>;
}
