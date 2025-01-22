import { z } from "zod";

export const TaskWeeklyPlanSchema = z.object({
    id: z.string(),
    cdp: z.string(),
    task: z.string(),
    week: z.number(),
    hours: z.number(),
    budget: z.number(),
    active_closure: z.boolean(),
    slots:z.number(),
    lote: z.string(),
    start_date:  z.union([z.string(), z.null()]),
    end_date:  z.union([z.string(), z.null()])
});

export const TasksWeeklyPlanSchema = z.object({
    finca: z.string(),
    week: z.number(),
    lote: z.string(),
    data: z.array(TaskWeeklyPlanSchema)
});