import { z } from 'zod';

export const WeeklyPlan = z.object({
    id: z.string(),
    year: z.number(),
    week: z.number(),
    finca: z.string(),
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
    data: z.object({
        id: z.string(),
        finca: z.string(),
        week: z.number(),
        year: z.number(),
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

export const WeeklyPlansPaginateSchema = z.object({
    data: z.array(WeeklyPlan),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

export const WeeklyPlansSchema = z.object({
    data: z.array(WeeklyPlan),
});

