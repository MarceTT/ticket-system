import * as z from "zod";

export const TicketSchema = z.object({
  title: z
    .string()
    .nonempty("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters"),
  assignedTo: z.string().nonempty("Assigned to is required"),
  project: z.string().nonempty("Subject is required"),
  description: z
    .string()
    .nonempty("Description is required")
    .min(5, "Description must be at least 5 characters")
    .max(190, "Description must be at most 190 characters"),
  category: z.string().nonempty("Category is required"),
  priority: z.string().nonempty("Priority is required"),
  createdBy: z.optional(z.string()),
  // image:z.any()
  // .refine((file) => file?.length == 1, 'File is required.')
  // .refine((file) => file[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`),
  image: z.any().optional(),
});
