import { z } from "zod";
import { validateRequiredString } from "./validations";

export const searchSchema = z.object({
  q: z
    .string(validateRequiredString("Search query"))
    .trim()
    .min(1, { message: "Search query is required." }),
  filter: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .enum(["all", "users", "posts"], { message: "Invalid filter" })
      .default("all")
  ),
  page: z.preprocess(
    (val) =>
      parseInt(
        z.string({ message: "Page must be string" }).default("1").parse(val),
        10
      ),
    z.number().min(1)
  ),
  limit: z.preprocess(
    (val) =>
      parseInt(
        z.string({ message: "Limit must be string" }).default("10").parse(val),
        10
      ),
    z.number().min(1).max(50)
  ),
});
