import { z } from "zod";
import { paginatedSchema } from "./schemas";
import { PaginatedRequestSchema } from "@/schemas/httpRequestsSchemas";

export const WeeklyPlanSchema = z.object({
    id: z.string(),
    year: z.number(),
    week: z.number(),
    finca: z.string(),
    finca_id: z.string(),
    created_at: z.string(),
    total_budget: z.number(),
    used_budget: z.number(),
    total_budget_ext: z.number(),
    used_total_budget_ext: z.number(),
    total_tasks: z.number(),
    finished_total_tasks: z.number(),
    total_tasks_crop: z.number(),
    finished_total_tasks_crops: z.number()
});

export const SummaryTasksSchema = z.array(z.object({
    lote: z.string(),
    total_budget: z.number(),
    lote_id: z.number(),
    total_workers: z.number(),
    total_hours: z.number(),
    total_tasks: z.number(),
    finished_tasks: z.number()

}));

export const SummaryTasksCropSchema = z.array(z.object({
    id: z.number(),
    lote_id: z.number(),
    lote: z.string()
}))

export const SummaryWeeklyPlanSchema = PaginatedRequestSchema.extend({
    data: SummaryTasksSchema
});

export const SummaryTasksCropWeeklyPlanSchema = PaginatedRequestSchema.extend({
    statusCode: z.number(),
    data: SummaryTasksCropSchema
});

export const WeeklyPlansSchema = z.object({
    data: z.array(WeeklyPlanSchema),
    meta: paginatedSchema.optional()
});



