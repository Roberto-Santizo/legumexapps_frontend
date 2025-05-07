// Este codigo yo lo agregue Luis

import { z } from "zod";

export const warehouseInputSchema = z.object({
    units: z.number(),
    unit_value: z.number(),
    total_value: z.number(),
    invoice: z.string(),
    invoice_date: z.string(),
    receipt_date: z.string(),
});

export const WarehouseSupplyPaginateSchema = z.object({
    data: z.array(warehouseInputSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
})

