import { z } from "zod";

export const LinePerformanceSchema = z.object({
    id: z.string(),
    line: z.string(),
    sku: z.string(),
    client: z.string(),
    product: z.string(),
    shift: z.string(),
    performance: z.number().nullable(),
    payment_method: z.number(),
    accepted_percentage: z.number()
});

export const PaginatedLinesPerformancesSchema = z.object({
    data: z.array(LinePerformanceSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});