import z from 'zod';

export const SummaryLineTasksSchema = z.object({
    line: z.string(),
    finished_tasks: z.number(),
    total_tasks: z.number(),
    percentage: z.number(),
});

export const SummaryLinesTasksShema = z.array(SummaryLineTasksSchema);

export const TaskProductionDashboardSchema = z.object({
    id: z.number(),
    line: z.string(),
    sku: z.string(),
    product: z.string(),
    operation_date: z.string()
});

export const TasksProductionDashboardSchema = z.array(TaskProductionDashboardSchema);

