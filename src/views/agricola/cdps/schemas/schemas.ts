import { ApiResponseSchema } from "@/schemas/httpRequestsSchemas";
import { paginatedSchema } from "@/utils/schemas";
import { z } from "zod";

export const PlantationControlSchema = z.object({
    id: z.string(),
    name: z.string(),
    lote: z.string(),
    start_date: z.string(),
    end_date: z.string()
})

export const PlantationControlDetailsSchema = ApiResponseSchema.extend({
    response: PlantationControlSchema
})

export const PlantationsControlSchema = z.object({
    data: z.array(PlantationControlSchema),
    meta: paginatedSchema.optional()
});




