import { z } from "zod";

export const VarietySchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const VarietiesSchema = z.object({
    data: z.array(VarietySchema)
});

export const VarietiesPaginateSchema = z.object({
    data: z.array(VarietySchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});
