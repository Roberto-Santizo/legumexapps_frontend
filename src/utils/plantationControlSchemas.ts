import { z } from "zod";
import { paginatedSchema } from "./schemas";

export const PlantationControlSchema = z.object({
    id: z.string(),
    crop: z.string(),
    name: z.string(),
    recipe: z.string(),
    density: z.number(),
    start_date: z.string(),
    end_date: z.union([z.string(), z.null()]),
    size: z.string(),
    aplication_week: z.number(),
    status: z.boolean()
});

export const PlantationsControlSchema = z.object({
    data: z.array(PlantationControlSchema),
    meta: paginatedSchema.optional()
});
