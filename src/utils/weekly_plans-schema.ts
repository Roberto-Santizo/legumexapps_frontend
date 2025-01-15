import { z } from 'zod';

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

export const WeeklyPlans = z.object({
    data: z.array(WeeklyPlan)
});
