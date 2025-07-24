import z from 'zod';

export const SummaryLineTasksSchema = z.object({
    line: z.string(),
    finished_tasks: z.number(),
    total_tasks: z.number(),
    percentage: z.number(),
});

export const SummaryLinesTasksShema = z.array(SummaryLineTasksSchema);

export const TaskProductionInProgressSchema = z.object({
    id: z.number(),
    line: z.string(),
    sku: z.string(),
    product: z.string(),
});

export const TasksProductionInProgressSchema = z.object({
    data: z.array(TaskProductionInProgressSchema)
});

