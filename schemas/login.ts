import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
      message: "Email is required",
    }).email("Invalid email"),
    password: z.string().min(1, {
      message: "Password is required",
    }).max(10, "Password must be at most 10 characters"),
   // code: z.optional(z.string()),
  });