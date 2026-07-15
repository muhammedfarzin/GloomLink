import z from "zod";

export const paginationSchema = z.object({
  page: z.preprocess((val) => {
    const parsed = parseInt(String(val), 10);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number().min(1).default(1)),
  limit: z.preprocess((val) => {
    const parsed = parseInt(String(val), 10);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number().min(5).max(50).default(5)),
  sort: z.preprocess(
    (v) => {
      if (typeof v === "string") {
        v = v.toLowerCase().trim();
        return v === "" ? "relevant" : v;
      }
      return v;
    },
    z.enum(["relevant", "latest", "oldest"]).optional(),
  ),
});
