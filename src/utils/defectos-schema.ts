import { z } from "zod";

export const DraftDefectoSchema = z.object({
    name: z.string(),
    tolerance_percentage: z.number(),
    variety_id: z.string(),
});