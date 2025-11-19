import { z } from "zod";

export const PackingMaterialItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    description: z.string(),
    blocked: z.boolean(),
});

export const PaginatedPackingMaterialItemsSchema = z.object({
    data: z.array(PackingMaterialItemSchema),
    meta: z.object({
        current_page: z.number(),
        last_page: z.number()
    }).optional()
});