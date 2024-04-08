import * as z from "zod";

export const SelectEditAssignedSchema = z.object({
    id: z.string().optional(),
    assignedTo: z.string().nonempty("Assigned to is required"),
});