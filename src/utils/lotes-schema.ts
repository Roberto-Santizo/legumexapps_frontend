import { z } from 'zod';

export const LoteSchema = z.object({
    id: z.string(),
    name: z.string(),
    finca: z.string(),
    cdp: z.string()
});

export const DraftLote = z.object({
    name: z.string(),
    finca_id: z.string(),
    cdp_id: z.string()
});

export const LotesSchemaSelect = z.object({
    data: z.array(LoteSchema)
});

export const LotesSchema = z.object({
    data: z.array(LoteSchema)
});


export const LotesPaginateSchema = z.object({
    data: z.array(LoteSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});