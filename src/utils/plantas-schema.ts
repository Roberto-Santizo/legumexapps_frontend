import { z } from "zod";

export const PlantaSchema = z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable()
});

export const PlantasSchema = z.object({
    data: z.array(PlantaSchema)
});