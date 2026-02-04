import { z } from "zod";
import { validateRequiredString } from "./validations";
import { usernameRegex } from "../../shared/regexPatterns";

export const passwordSchema = z
  .string(validateRequiredString("Password", "Invalid credentials"))
  .trim()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      "Password must be at least 8 characters long and include at least one letter, one number, and one special character.",
  });

export const loginInputSchema = z.object({
  username: z
    .string(validateRequiredString("Username or email", "Invalid credentials"))
    .trim()
    .min(1, { message: "Username or email is required" }),
  password: z
    .string(validateRequiredString("Password", "Invalid credentials"))
    .trim()
    .min(1, { message: "Password is required" }),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const signupInputSchema = z.object({
  // --- Required Fields ---
  firstname: z
    .string(validateRequiredString("First name"))
    .trim()
    .min(1, { message: "First name is required" }),
  lastname: z
    .string(validateRequiredString("Last name"))
    .trim()
    .min(1, { message: "Last name is required" }),
  username: z
    .string(validateRequiredString("Username"))
    .trim()
    .regex(usernameRegex, { message: "Invalid username format" }),
  email: z.email({ message: "Invalid email address" }),
  mobile: z
    .string(validateRequiredString("Mobile number"))
    .regex(/^[6-9]\d{9}$/, { message: "Invalid mobile number" }),
  password: passwordSchema,

  // --- Optional Fields ---
  gender: z
    .enum(["m", "f"], { message: "Gender must be male or female" })
    .optional(),
  dob: z.iso
    .datetime()
    .optional()
    .transform((dateStr, ctx) => {
      if (!dateStr) return undefined;
      const date = new Date(dateStr);
      if (date > new Date()) {
        ctx.addIssue({
          format: "datetime",
          code: "invalid_format",
          message: "Date of birth cannot be in the future",
        });
        return z.NEVER;
      }
      return date;
    }),
});

export type SignupInput = z.infer<typeof signupInputSchema>;

export const otpInputSchema = z.object({
  otp: z
    .string(validateRequiredString("OTP"))
    .regex(/^\d{6}$/, { message: "Invalid OTP!" }),
});

export type OtpInput = z.infer<typeof otpInputSchema>;

export const googleAuthSchema = z.object({
  token: z
    .string(validateRequiredString("Google auth token"))
    .min(1, { message: "Google auth token is required" }),
});

export type GoogleAuth = z.infer<typeof googleAuthSchema>;

export const refreshTokenSchema = z.object({
  token: z
    .string(validateRequiredString("Refresh token"))
    .min(1, { message: "Refresh token is required" }),
});

export type RefreshToken = z.infer<typeof refreshTokenSchema>;

export const adminLoginInputSchema = z.object({
  username: z
    .string(validateRequiredString("Username", "Invalid credentials!"))
    .min(1, { message: "Username is required" }),
  password: z
    .string(validateRequiredString("Password", "Invalid credentials!"))
    .min(1, { message: "Password is required" }),
});

export type AdminLoginInput = z.infer<typeof adminLoginInputSchema>;
