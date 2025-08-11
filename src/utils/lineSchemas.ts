import { z } from "zod";

export const PositionSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const LineaSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    shift: z.string(),
    positions: z.array(PositionSchema).optional(),
});

export const LineDetailSchema = z.object({
    data: LineaSchema
});

export const LinesPaginatedSchema = z.object({
    data: z.array(LineaSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    }).optional()
});


export const LineaSelectSchema = z.object({
    value: z.string(),
    label: z.string(),
    performance: z.number().nullable()
});

export const LinesSelectSchema = z.object({
    data: z.array(LineaSelectSchema)
});


export const SkuByLineShema = z.object({
    id: z.string(),
    sku: z.string(),
    sku_description: z.string(),
    start_date: z.string(),
    end_date: z.string(),
});

export const LinePerformanceByDaySchema = z.object({
    max_value: z.number(),
    details: z.array(SkuByLineShema).nullable(),
    summary: z.object({
        HBiometrico: z.number(),
        HPlan: z.number(),
        HLinea: z.number(),
        HRendimiento: z.number(),
    })
});

export const LineHoursPerWeekSchema = z.object({
    line_id: z.string(),
    line: z.string(),
    total_hours: z.number()
});

export const LinesHoursPerWeekSchema = z.array(LineHoursPerWeekSchema);