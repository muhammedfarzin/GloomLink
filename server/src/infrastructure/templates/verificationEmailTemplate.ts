import { createAuthCodeEmailHtml } from "./authCodeEmailTemplate";

export const verificationEmailSubject = "Your GloomLink verification code";

export function createVerificationEmailHtml(otp: string): string {
  return createAuthCodeEmailHtml({
    subject: verificationEmailSubject,
    preheader:
      "Your one-time code is inside. Enter it to verify your GloomLink email.",
    badge: "Email verification",
    heading: "Your account is almost ready",
    description:
      "Enter this one-time verification code in GloomLink to confirm your email address.",
    code: otp,
    securityNote:
      "For your security, do not share this code with anyone. If you did not request it, you can safely ignore this email.",
  });
}
