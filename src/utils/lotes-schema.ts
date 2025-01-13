import { z } from 'zod';

export const Lote = z.object({
    id: z.number(),
    name: z.string(),
    finca: z.string()
});

export const DraftLote = z.object({
    name: z.string(),
    finca_id: z.string()
});


export const Lotes = z.object({
    data: z.array(Lote)
});