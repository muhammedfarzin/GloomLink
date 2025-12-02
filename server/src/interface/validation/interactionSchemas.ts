import { z } from "zod";
import { validateRequiredString } from "./validations";

export const recordInteractionSchema = z.object({
  postId: z.string(validateRequiredString("Post ID")),
  type: z.enum(["view", "like", "comment", "save"]),
});
