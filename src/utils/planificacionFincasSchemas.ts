import { z } from "zod";
import { paginatedSchema } from "./schemas";

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

export const SummaryWeeklyPlanSchema = z.object({
    data: WeeklyPlanSchema.pick({ id: true, year: true, week: true, finca: true }).extend({
        summary_tasks: z.array(z.object({
            lote: z.string(),
            total_budget: z.number(),
            lote_plantation_control_id: z.string(),
            total_workers: z.number(),
            total_hours: z.number(),
            total_tasks: z.number(),
            finished_tasks: z.number()

        })),
        summary_crops: z.array(z.object({
            id: z.string(),
            lote_plantation_control_id: z.string(),
            lote: z.string()
        }))
    })
});

export const WeeklyPlansSchema = z.object({
    data: z.array(WeeklyPlanSchema),
    meta: paginatedSchema.optional()
});



