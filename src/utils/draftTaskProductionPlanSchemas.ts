import { z } from "zod";

export const DraftTaskProductionPlanSchema = z.object({
    id: z.string(),
    total_lbs: z.number(),
    line: z.string(),
    sku: z.string(),
    destination: z.string(),
    product_name: z.string()
});

export const DraftTaskProductionPlanEditDetailsSchema = z.object({
    id: z.number(),
    line_id: z.number().nullable(),
    stock_keeping_unit_id: z.number(),
    total_lbs: z.number(),
    destination: z.string()
});