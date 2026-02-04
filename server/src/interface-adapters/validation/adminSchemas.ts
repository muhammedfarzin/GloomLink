import { z } from "zod";

export const getPostsSchema = z.object({
  q: z.string({ message: "Search query must be string" }).optional(),
  filter: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .enum(["all", "active", "blocked", "reported"], {
        message: "Invalid filter",
      })
      .default("all")
  ),
  page: z.preprocess(
    (val) => parseInt(z.string().default("1").parse(val), 10),
    z.number().min(1)
  ),
  limit: z.preprocess(
    (val) => parseInt(z.string().default("10").parse(val), 10),
    z.number().min(1).max(100)
  ),
});

export const getUsersSchema = z.object({
  q: z.string({ message: "Search query must be string" }).optional(),
  filter: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .enum(["all", "active", "blocked"], {
        message: "Invalid filter",
      })
      .default("all")
  ),
  page: z.preprocess(
    (val) => parseInt(z.string().default("1").parse(val), 10),
    z.number().min(1)
  ),
  limit: z.preprocess(
    (val) => parseInt(z.string().default("20").parse(val), 10),
    z.number().min(1).max(100)
  ),
});
