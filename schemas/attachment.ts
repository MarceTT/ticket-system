import * as z from "zod";

export const AttachmentSchema = z.object({
    file: z.any().optional(),
});