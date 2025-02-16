import { z } from "zod";

export const DronHoursSchema = z.object({
    hours: z.number()
});

export const SummaryHoursEmployeeSchema = z.object({
    id: z.number(),
    code: z.string().nullable(),
    first_name: z.string(),
    weekly_hours: z.number(),
    assigned: z.boolean()
});

export const SummaryHoursEmployeesSchema = z.object({
    data: z.array(SummaryHoursEmployeeSchema)
});

export const TaskInProgressSchema = z.object({
    id: z.string(),
    task: z.string(),
    finca: z.string(),
    lote: z.string(),
    week:z.number(),
    assigned_employees: z.number(),
    total_employees: z.number().nullable(),
    paused: z.boolean(),
    has_insumos: z.boolean()
});

export const TasksInProgressSchema = z.object({
    data: z.array(TaskInProgressSchema)
});

export const FinishedTaskSchema = z.object({
    id: z.string(),
    task: z.string(),
    finca: z.string(),
    lote: z.string(),
    start_date: z.string(),
    end_date: z.string(),
});

export const FinishedTasksSchema = z.object({
    data: z.array(FinishedTaskSchema)
});

export const SummaryFincaTasksSchema = z.object({
    id: z.string(),
    finca: z.string(),
    finished_tasks: z.number(),
    total_tasks: z.number(),
    percentage: z.number()
});

export const FinishedTasksByFincaSchema = z.object({
    data: z.array(SummaryFincaTasksSchema)
})