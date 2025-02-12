import { z } from "zod";


export const DraftBoletaSchema = z.object({
    coordinator_name: z.string(),
    product_id: z.string(),
    transport: z.string(),
    pilot_name: z.string(),
    inspector_name: z.string(),
    cdp: z.string(),
    transport_plate: z.string(),
    weight: z.number(),
    total_baskets: z.number(),
    quality_percentage: z.number(),
    inspector_signature: z.string(),
    prod_signature: z.string(),
    basket_id: z.string()
});

export const BoletaRMPDetailSchema = z.object({
    id: z.string(),
    plate:  z.string(),
    product:  z.string(),
    variety:  z.string(),
    coordinator:  z.string(),
    cdp:  z.string(),
    transport: z.string(),
    baskets: z.number(),
    gross_weight:  z.number(),
    weight_baskets: z.number(),
    net_weight:  z.number(),
    percentage_field: z.number(),
    valid_pounds: z.number(),
    status: z.number()
});

export const BoletaSchema = z.object({
    id: z.string(),
    plate: z.string(),
    product: z.string(),
    variety: z.string(),
    coordinator: z.string(),
    cdp: z.string(),
    transport: z.string(),
    status: z.number()
});

export const BoletasPaginateSchema = z.object({
    data: z.array(BoletaSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

