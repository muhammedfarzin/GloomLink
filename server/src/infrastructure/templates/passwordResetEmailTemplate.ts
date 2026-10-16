import { createAuthCodeEmailHtml } from "./authCodeEmailTemplate";

export const passwordResetEmailSubject = "Your GloomLink password reset code";

export function createPasswordResetEmailHtml(code: string): string {
  return createAuthCodeEmailHtml({
    subject: passwordResetEmailSubject,
    preheader:
      "Your password reset code is inside. It expires in five minutes.",
    badge: "Password reset",
    heading: "Reset your password",
    description:
      "Enter this one-time code in GloomLink to choose a new password. It expires in five minutes.",
    code,
    securityNote:
      "For your security, do not share this code with anyone. If you did not request a password reset, you can safely ignore this email.",
  });
}
