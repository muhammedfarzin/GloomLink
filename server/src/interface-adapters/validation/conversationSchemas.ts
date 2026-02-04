import { z } from "zod";

export const createConversationSchema = z.object({
  participants: z.preprocess(
    (val) => {
      if (!(val instanceof Array) && typeof val !== "string") return [];
      if (typeof val === "string") {
        return val.split(",").map((id) => id.trim());
      }
      return val;
    },
    z
      .array(z.string({ message: "Participant must be array of string" }))
      .transform((arr) => arr.filter((id) => id !== ""))
      .pipe(
        z
          .string({ message: "Participant must be array of string" })
          .min(1)
          .array()
      )
  ),
});
