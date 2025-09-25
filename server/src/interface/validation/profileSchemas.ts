import { z } from "zod";
import { usernameRegex } from "../../shared/regexPatterns";
import { validateRequiredString } from "./validations";

export const updateProfileSchema = z.object({
  firstname: z
    .string(validateRequiredString("First name"))
    .trim()
    .min(1, { message: "First name is required" }),
  lastname: z
    .string(validateRequiredString("Last name"))
    .trim()
    .min(1, { message: "Last name is required" }),
  username: z
    .string()
    .trim()
    .regex(usernameRegex, { message: "Invalid username format" }),
  mobile: z
    .string(validateRequiredString("Mobile number"))
    .regex(/^[6-9]\d{9}$/, { message: "Invalid mobile number" }),
  password: z
    .string(validateRequiredString("Password", "Invalid credentials"))
    .trim()
    .optional(),
  newPassword: z
    .string(validateRequiredString("Password", "Invalid credentials"))
    .trim()
    .refine(
      (val) =>
        !val ||
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
          val
        ),
      {
        message:
          "Password must be at least 8 characters long and include at least one letter, one number, and one special character.",
      }
    )
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
  gender: z
    .enum(["m", "f"], { message: "Gender must be male or female" })
    .optional(),
});

export type UpdateProfileInputDto = z.infer<typeof updateProfileSchema>;
