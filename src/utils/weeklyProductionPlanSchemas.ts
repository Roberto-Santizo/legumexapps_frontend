import { z } from "zod";
import { paginatedSchema } from "./schemas";
import { TaskProductionEventSchema, TaskProductionNoOperationDateSchema, TaskProductionOperationDateSchema } from "./taskProductionPlanSchemas";

export const WeeklyProductionPlanSchema = z.object({
    id: z.string(),
    week: z.number(),
    year: z.number(),
})

export const WeeklyProductionPlansSchema = z.object({
    data: z.array(WeeklyProductionPlanSchema),
    meta: paginatedSchema.optional()
});

export const LineWeeklyProductionPlanSchema = z.object({
    id: z.string(),
    line: z.string(),
    status: z.boolean(),
    total_employees: z.number(),
    assigned_employees: z.number()
});

export const WeeklyProductionPlanSummarySchema = z.object({
    data: z.array(LineWeeklyProductionPlanSchema)
});

export const WeeklyProductionPlanTasksSchema = z.array(TaskProductionNoOperationDateSchema);
export const WeeklyProductionPlanEventsShema = z.array(TaskProductionEventSchema);

export const WeeklyPlanTasksOperationDateSchema = z.object({
    data: z.array(TaskProductionOperationDateSchema)
});