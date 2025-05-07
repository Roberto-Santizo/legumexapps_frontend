// Este codigo yo lo agregue Luis

import { z } from "zod";

export const WareHouseSupplierSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
});

export const warehousePaginateSchema = z.object({
    data: z.array(WareHouseSupplierSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
})

export const warehousesPaginateSchema = z.object({
    data: z.array(WareHouseSupplierSchema)
});