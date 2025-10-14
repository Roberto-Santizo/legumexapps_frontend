import { ApiResponseSchema, PaginatedRequestSchema } from "./httpRequestsSchemas";
import z from "zod";

export const DraftWeeklyPlansSchema = PaginatedRequestSchema.extend({
    data: z.array(z.object({
        id: z.number(),
        finca: z.string(),
        week: z.number(),
        year: z.number()
    }))
});

export const TaskPlantationControlSchema = z.object({
    id: z.number(),
    task: z.string(),
    lote: z.string(),
    recipe: z.string(),
    budget: z.number(),
    hours: z.number(),
    tags: z.string().nullable(),
    slots: z.number(),
    draft_weekly_plan_id: z.number()
});

export const PlantationControlTasksSchema = z.record(z.string(), z.array(TaskPlantationControlSchema));

export const DraftWeeklyPlanSchema = ApiResponseSchema.extend({
    data: z.object({
        id: z.number(),
        finca: z.string(),
        week: z.number(),
        tasks: PlantationControlTasksSchema.optional()
    })
});

export const TaskPlantationControlEditSchema = ApiResponseSchema.extend({
    data: TaskPlantationControlSchema.pick({ hours: true, budget: true, slots: true, tags: true }).extend({
        draft_weekly_plan_id: z.number()
    })
})