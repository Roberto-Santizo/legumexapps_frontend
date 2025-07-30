import { z } from "zod";
import { paginatedSchema } from "./schemas";

export const MateriaPrimaItemSchema = z.object({
    id: z.string(),
    code: z.string(),
    product_name: z.string(),
    type: z.string()
});

export const MateriaPrimaItemsSchema = z.object({
    data: z.array(MateriaPrimaItemSchema),
    meta: paginatedSchema
})