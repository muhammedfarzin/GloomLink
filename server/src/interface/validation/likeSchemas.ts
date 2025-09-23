import { z } from "zod";
import { isValidObjectId, validateRequiredString } from "./validations";

const commonSchema = {
  type: z.enum(["post"], {
    message: "Type must be 'post'",
  }),
  targetId: z
    .string(validateRequiredString("Target ID"))
    .trim()
    .refine(isValidObjectId, { message: "Invalid Target Id" }),
};

export const getLikedUsersSchema = z.object({
  ...commonSchema,
  page: z.preprocess(
    (val) => parseInt(z.string().default("1").parse(val), 10),
    z.number().min(1)
  ),
  limit: z.preprocess(
    (val) => parseInt(z.string().default("10").parse(val), 10),
    z.number().min(1).max(50)
  ),
});

export const toggleLikeSchema = z.object(commonSchema);
