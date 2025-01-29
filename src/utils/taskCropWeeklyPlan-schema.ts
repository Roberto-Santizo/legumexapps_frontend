import { z } from "zod";

export const TaskCropIncompleteSchema = z.object({
    id: z.string(),
    lbs_finca: z.number(),
    lbs_planta: z.union([z.null(),z.number()]),
    date: z.string()
});

export const TasksCropIncompleteSchema = z.object({
    data: z.array(TaskCropIncompleteSchema)
});

export const TaskCropWeeklyPlanSchema = z.object({
    id: z.string(),
    task: z.string(),
    cultivo: z.string(),
    finca_id: z.string(),
    assigment_today: z.boolean(),
    finished_assigment_today: z.boolean(),
    closed: z.boolean(),
    incomplete: z.boolean()
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
    code: z.string(),
    lbs: z.union([z.number(),z.null()])

});

export const EmployeesTaskCropPlanSchema = z.object({
    task: z.string(),
    week: z.number(),
    finca: z.string(),
    date_assignment: z.string(),
    data: z.array(EmployeeTaskCropPlanSchema),

});


