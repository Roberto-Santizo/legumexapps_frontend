import { z } from "zod";

export const TaskCropWeeklyPlanSchema = z.object({
    id: z.string(),
    task: z.string(),
    cultivo: z.string(),
    finca_id: z.string(),
    assigment_today: z.boolean(),
    finished_assigment_today: z.boolean()
});

export const TasksCropWeeklyPlanSchema = z.object({
    week: z.number(),
    finca: z.string(),
    lote: z.string(),
    tasks: z.array(TaskCropWeeklyPlanSchema),
});

export const EmployeeTaskCropPlanSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string()
});

export const EmployeesTaskCropPlanSchema = z.object({
    task: z.string(),
    week: z.number(),
    finca: z.string(),
    date_assignment: z.string(),
    data: z.array(EmployeeTaskCropPlanSchema),

});


