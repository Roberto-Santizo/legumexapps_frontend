import { z } from "zod";

export const QualityVarietySchema = z.object({
    id: z.string(),
    name: z.string()
});

export const QualityVarietiesSchema = z.object({
    data: z.array(QualityVarietySchema)
});

export const QualityVarietiesPaginateSchema = z.object({
    data: z.array(QualityVarietySchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});
