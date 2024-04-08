import * as z from "zod";

export const CommentSchema = z.object({
  comment: z
    .string()
    .min(1, {
      message: "Comment is required",
    })
    .max(255, "Comment must be at most 255 characters"),
});
