import { PaginatedRequestSchema } from "@/schemas/httpRequestsSchemas";
import { z } from "zod";

export const TaskGuidelineSchema = z.object({
    crop: z.string(),
    finca: z.string(),
    hours_per_size: z.number(),
    id: z.number(),
    recipe: z.string(),
    task: z.string(),
    week: z.number()
});

export const TasksGuideLineSchema = PaginatedRequestSchema.extend({
    data: z.array(TaskGuidelineSchema)
})

export const RecipeSchema = z.object({
    id: z.string(),
    name: z.string()
});

export const RecipesSchema = PaginatedRequestSchema.extend({
    data: z.array(RecipeSchema)
});

export const CropSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string()
});

export const CropsSchema = PaginatedRequestSchema.extend({
    data: z.array(CropSchema)
});