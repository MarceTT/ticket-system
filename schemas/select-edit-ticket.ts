import * as z from "zod";

export const SelectEditTicketSchema = z.object({
    id: z.string().optional(),
    priority: z.string().nonempty("Priority is required"),
    category: z.string().nonempty("Category is required"),
});
