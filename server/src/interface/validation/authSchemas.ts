import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      "Password must be at least 8 characters long and include at least one letter, one number, and one special character.",
  });

export const signupInputSchema = z.object({
  // --- Required Fields ---
  firstname: z.string().trim().min(1, { message: "First name is required" }),
  lastname: z.string().trim().min(1, { message: "Last name is required" }),
  username: z.string().trim().min(1, { message: "Username is required" }),
  email: z.email({ message: "Invalid email address" }),
  mobile: z
    .string()
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
  otp: z.string().regex(/^\d{6}$/, { message: "Invalid OTP!" }),
});

export type OtpInput = z.infer<typeof otpInputSchema>;
