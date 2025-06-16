import { RecipeSchema } from "@/utils/recipeSchemas";
import { z } from "zod";

export type Recipe = z.infer<typeof RecipeSchema>

