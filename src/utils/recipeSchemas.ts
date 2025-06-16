import { z } from "zod";

export const RecipeSchema = z.object({
    id: z.string(),
    name: z.string()
});

export const RecipesSchema = z.object({
    data: z.array(RecipeSchema)
});