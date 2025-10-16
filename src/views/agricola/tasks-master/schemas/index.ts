import { PaginatedRequestSchema } from "@/schemas/httpRequestsSchemas";
import { z } from "zod";

export const TaskGuidelineSchema = z.object({
    budget: z.number(),
    crop: z.string(),
    finca: z.string(),
    hours: z.number(),
    id: z.number(),
    recipe: z.string(),
    task: z.string(),
    week: z.number()
});

export const TasksGuideLineSchema = PaginatedRequestSchema.extend({
    data: z.array(TaskGuidelineSchema)
})