import { z } from 'zod';

export const WeeklyPlan = z.object({
    id: z.string(),
    year: z.number(),
    week: z.number(),
    finca: z.string(),
    created_at: z.string(),
    budget: z.string(),
    budget_ext: z.string(),
    tasks: z.string(),
    tasks_crop: z.string()

});

export const WeeklyPlans = z.object({
    data: z.array(WeeklyPlan)
});
