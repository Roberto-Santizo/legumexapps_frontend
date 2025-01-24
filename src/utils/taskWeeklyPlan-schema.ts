import { z } from "zod";

export const TaskWeeklyPlanSchema = z.object({
    id: z.string(),
    cdp: z.string(),
    task: z.string(),
    week: z.number(),
    hours: z.number(),
    budget: z.number(),
    active_closure: z.boolean(),
    slots: z.number(),
    lote: z.string(),
    minimum_slots: z.number(),
    start_date: z.union([z.string(), z.null()]),
    end_date: z.union([z.string(), z.null()])
});

export const TaskWeeklyPlanDetailsSchema = z.object({
    task: z.string(),
    lote: z.string(),
    week: z.number(),
    finca: z.string(),
    aplication_week: z.number(),
    start_date: z.union([z.string(),z.null()]),
    end_date: z.union([z.string(),z.null()]),
    hours: z.number(),
    real_hours: z.union([z.number(),z.null()]),
    slots: z.number(),
    total_employees: z.number(),
    employees: z.array(
        z.object({
            name: z.string(),
            code: z.string(),
        })
    ),
    closures: z.array(z.object({
        start_date: z.string(),
        end_date: z.string()
    }))
});

export const TasksWeeklyPlanSchema = z.object({
    finca: z.string(),
    week: z.number(),
    lote: z.string(),
    data: z.array(TaskWeeklyPlanSchema)
});