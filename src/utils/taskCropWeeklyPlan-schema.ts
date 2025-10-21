import { PaginatedRequestSchema } from "@/schemas/httpRequestsSchemas";
import { z } from "zod";

export const TaskCropIncompleteSchema = z.object({
    id: z.string(),
    lbs_finca: z.number(),
    lbs_planta: z.union([z.null(), z.number()]),
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
    incomplete: z.boolean(),
    has_assigments: z.boolean(),
});

export const TaskCropWeeklyPlanDetailSchema = z.object({
    finca: z.string(),
    week: z.number(),
    lote: z.string(),
    cdp: z.string(),
    assigments: z.array(z.object({
        id: z.number(),
        lbs_planta: z.number(),
        lbs_finca: z.number(),
        plants: z.number(),
        start_hour: z.string(),
        end_hour: z.string(),
        date: z.string()
    })),
    employees: z.array(z.object({
        id: z.number(),
        daily_assignment_id: z.number(),
        name: z.string(),
        code: z.string(),
        lbs: z.number(),
        date: z.string()
    })
    )
});

export const TasksCropWeeklyPlanSchema = PaginatedRequestSchema.extend({
    data: z.array(TaskCropWeeklyPlanSchema),
})

export const EmployeeTaskCropPlanSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    lbs: z.union([z.number(), z.null()])

});


export const EmployeesTaskCropPlanSchema = z.object({
    task: z.string(),
    week: z.number(),
    finca: z.string(),
    date_assignment: z.string(),
    data: z.array(EmployeeTaskCropPlanSchema),
});

export const DraftTaskCropWeeklyPlanSchema = z.object({
    weekly_plan_id: z.string(),
    lote_id: z.string(),
    task_crop_id: z.string()
});

export const TaskCropSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string()
});

export const TasksCropSchema = z.object({
    data: z.array(TaskCropSchema)
});
