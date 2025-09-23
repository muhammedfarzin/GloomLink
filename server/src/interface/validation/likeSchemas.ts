import { z } from "zod";
import { isValidObjectId, validateRequiredString } from "./validations";

export const getLikedUsersSchema = z.object({
  targetId: z
    .string(validateRequiredString("Target ID"))
    .trim()
    .refine(isValidObjectId, { message: "Invalid Target Id" }),
  type: z.enum(["post"], {
    message: "Type must be 'post'",
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
