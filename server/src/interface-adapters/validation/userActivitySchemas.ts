import { z } from "zod";

// Public tracking accepts views only. Likes/saves go through validated toggle flows.
export const recordPostViewActivitySchema = z.object({
  postId: z.string().regex(/^[a-fA-F0-9]{24}$/),
  action: z.literal("view"),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
