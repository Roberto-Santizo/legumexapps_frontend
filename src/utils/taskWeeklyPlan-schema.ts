import { z } from "zod";

export const TaskWeeklyPlanSchema = z.object({
    id: z.string(),
    cdp: z.string(),
    task: z.string(),
    week: z.number(),
    hours: z.number(),
    budget: z.number(),
    start_date:  z.union([z.string(), z.null()]),
    end_date:  z.union([z.string(), z.null()])
});

export const TasksWeeklyPlanSchema = z.object({
    data: z.array(TaskWeeklyPlanSchema)
});