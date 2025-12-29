import { z } from "zod";
import { paginatedSchema } from "./schemas";
import { TaskWeeklyPlanSummarySchema } from "./taskWeeklyPlanSchemas";

export const DataSchema = z.record(z.array(TaskWeeklyPlanSummarySchema));

export const LoteSchema = z.object({
    id: z.string(),
    name: z.string(),
    finca: z.string(),
    size: z.number(),
    total_plants: z.number()
});

export const DataLoteSchema = z.object({
    lote: z.string(),
    cdp: z.string(),
    start_date_cdp: z.string(),
    end_date_cdp: z.string().nullable()
});


export const LotesSchema = z.object({
    data: z.array(LoteSchema),
    meta: paginatedSchema.optional()
});

export const LoteCDPDetailsSchema = z.object({
    data_lote: DataLoteSchema,
    data: DataSchema,
});