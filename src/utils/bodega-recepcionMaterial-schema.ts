// Este codigo yo lo agregue Luis

import { z } from "zod";

export const MaterialReceptionSchema = z.object({
    lote: z.string(),
    quantity: z.string(),
    receipt_date: z.string(),
    invoice_date: z.string(),
});

export const MaterialReceptionPaginateSchema = z.object({
    data: z.array(MaterialReceptionSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
})
