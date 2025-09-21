import { z } from "zod";
import { validateRequiredString } from "./validations";

export const createPostSchema = z.object({
  caption: z.string(validateRequiredString("Caption")).optional(),
  tags: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return val.split(",").map((tag) => tag.trim());
      }
      return val;
    },
    z
      .array(z.string(validateRequiredString("Tags")).toLowerCase())
      .optional()
      .default([])
  ),
  publishedFor: z.enum(["public", "subscriber"]).optional().default("public"),
});

export type CreatePostInputDto = z.infer<typeof createPostSchema>;
