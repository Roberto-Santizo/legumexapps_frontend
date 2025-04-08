import { DefectSchema } from "@/api/ProductsAPI";
import { z } from "zod";


export const DefectsSchema = z.object({
    data: z.array(DefectSchema)
});
;

export const DefectsPaginateSchema = z.object({
    data: z.array(DefectSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});
