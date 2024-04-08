import * as z from "zod";

export const SelectStatusSchema = z.object({
    id: z.string().optional(),
    status: z.string().nonempty("Status is required"),
});