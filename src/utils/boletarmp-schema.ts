import { z } from "zod";


export const DraftBoletaSchema = z.object({
    coordinator_name: z.string(),
    product_id: z.string(),
    transport: z.string(),
    pilot_name: z.string(),
    inspector_name: z.string(),
    doc_date: z.string(),
    cdp: z.string(),
    transport_plate: z.string(),
    weight: z.number(),
    total_baskets: z.number(),
    quality_percentage: z.number(),
    inspector_signature: z.string(),
    prod_signature: z.string()
});