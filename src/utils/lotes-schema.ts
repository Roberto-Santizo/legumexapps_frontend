import { z } from 'zod';

export const Lote = z.object({
    id: z.number(),
    name: z.string(),
    finca: z.string(),
    cdp: z.string()
});

export const DraftLote = z.object({
    name: z.string(),
    finca_id: z.string(),
    cdp_id: z.string()
});


export const LotesSchema = z.object({
    data: z.array(Lote),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});