import { z } from "zod";
import { isValidObjectId, validateRequiredString } from "./validations";

export const addCommentSchema = z.object({
  targetId: z
    .string(validateRequiredString("Target ID"))
    .trim()
    .refine(isValidObjectId, { message: "Invalid Target Id" }),
  comment: z
    .string(validateRequiredString("Comment"))
    .trim()
    .min(1, { message: "Comment cannot be empty" }),
  type: z.enum(["post", "comment"], {
    message: "Type must be 'post' or 'comment'",
  }),
});

export const getCommentsSchema = z.object({
  targetId: z
    .string(validateRequiredString("Target ID"))
    .trim()
    .min(1, { message: "Target ID is required" })
    .refine(isValidObjectId, { message: "Invalid Target ID" }),
  type: z.enum(["post", "comment"], {
    message: "Type must be 'post' or 'comment'",
  }),
  page: z.preprocess(
    (val) => parseInt(z.string().default("1").parse(val), 10),
    z.number().min(1)
  ),
  limit: z.preprocess(
    (val) => parseInt(z.string().default("10").parse(val), 10),
    z.number().min(1).max(50)
  ),
});
