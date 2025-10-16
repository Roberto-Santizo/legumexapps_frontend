import { z } from "zod";
import { paginatedSchema } from "./schemas";

export const PlantationControlSchema = z.object({
    id: z.string(),
    name: z.string(),
    start_date: z.string(),
    end_date: z.union([z.string(), z.null()]),
    lote: z.string()
});

export const PlantationsControlSchema = z.object({
    data: z.array(PlantationControlSchema),
    meta: paginatedSchema.optional()
});

export const PlantationControlsByLoteSchema = z.object({
    data: z.array(PlantationControlSchema.pick({id:true,name:true}))
})



