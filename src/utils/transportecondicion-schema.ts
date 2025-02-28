import { z } from "zod";

export const DraftTransporteCondicionSchema = z.object({
    name: z.string(),
});

export const TransporteConditionSchema = z.object({
    id: z.string(),
    name: z.string()
});

export const TransporteInspectionSchema = z.object({
    id:z.string(),
    pilot_name: z.string(),
    truck_type: z.string(),
    plate: z.string(),
    date: z.string(),
    product: z.string(),
    variety: z.string(),
    finca: z.string(),
    planta: z.string()
});

export const TransporteInspectionsPaginateSchema = z.object({
    data: z.array(TransporteInspectionSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

export const TransporteConditionsSchema = z.object({
    data: z.array(TransporteConditionSchema)
});

export const TransporteConditionsPaginateSchema = z.object({
    data: z.array(TransporteConditionSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});