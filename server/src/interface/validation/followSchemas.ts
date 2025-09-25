import { z } from "zod";
import { isValidObjectId, validateRequiredString } from "./validations";

export const getFollowListSchema = z.object({
  userId: z
    .string(validateRequiredString("User ID"))
    .trim()
    .min(1, { message: "User ID is required" })
    .refine(isValidObjectId, { message: "Invalid User ID" }),

  listType: z.enum(["followers", "following"], {
    message: "List type must be 'followers' or 'following'",
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
