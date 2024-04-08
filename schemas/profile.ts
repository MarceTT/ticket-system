import * as z from "zod";

export const ProfileSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Username is required",
    })
    .max(20, "Username must be at most 20 characters"),
  email: z
    .string()
    .email({
      message: "Email is required",
    })
    .email("Invalid email"),
    image: z.any().optional(),
});
