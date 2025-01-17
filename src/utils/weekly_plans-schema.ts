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
    tasks_crop: z.string()

});

export const SummaryWeeklyPlan = z.object({
    data: z.object({
        finca: z.string(),
        week: z.number(),
        year: z.number(),
        summary: z.array(z.object({
            lote: z.string(),
            total_budget: z.number(),
            lote_plantation_control_id: z.string(),
            total_workers: z.number(),
            total_hours: z.number(),
            total_tasks: z.number(),
            finished_tasks: z.number()

        }))
    })

});

export const WeeklyPlans = z.object({
    data: z.array(WeeklyPlan)
});
