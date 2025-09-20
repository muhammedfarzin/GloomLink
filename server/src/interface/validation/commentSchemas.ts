import { z } from "zod";
import { validateRequiredString } from "./requiredValidation";

export const addCommentSchema = z.object({
  targetId: z
    .string(validateRequiredString("Target ID"))
    .min(1, { message: "Target ID is required" }),
  comment: z
    .string(validateRequiredString("Comment"))
    .trim()
    .min(1, { message: "Comment cannot be empty" }),
  type: z.enum(["post", "comment"], {
    message: "Comment type must be 'post' or 'comment'",
  }),
});
