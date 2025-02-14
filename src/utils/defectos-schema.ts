import { z } from "zod";

export const DraftDefectoSchema = z.object({
    name: z.string(),
    tolerance_percentage: z.number(),
    quality_variety_id: z.string(),
});

export const DefectSchema = z.object({
    id: z.string(),
    name: z.string(),
    tolerance_percentage: z.number(),
    status: z.boolean(),
    quality_variety: z.string()
 });

 export const DefectsSchema = z.object({
    data: z.array(DefectSchema)
 });

export const DefectsPaginateSchema = z.object({
    data: z.array(DefectSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});
