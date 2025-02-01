import { z } from "zod";


export const InsumoSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    measure: z.string()
});

export const InsumosSchema = z.object({
    data: z.array(InsumoSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});