import { z } from "zod";
import { validateRequiredString } from "./validations";
import { isValidObjectId } from "mongoose";

export const reportTargetSchema = z.object({
  targetId: z
    .string(validateRequiredString("Target ID"))
    .trim()
    .refine(isValidObjectId, { message: "Invalid Target Id" }),
  type: z.enum(["post", "user"], {
    message: "Type must be 'post' or 'user'",
  }),
});
