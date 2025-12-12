import { z } from "zod";
import { ApiResponseSchema } from "./httpRequestsSchemas";

export const TaskInsumoSchema = z.object({
    id: z.string(),
    name: z.string(),
    assigned_quantity: z.number(),
    measure: z.string(),
    used_quantity: z.number().nullable()
});

export const TaskWeeklyPlanSchema = z.object({
    id: z.string(),
    cdp: z.string(),
    task: z.string(),
    week: z.number(),
    hours: z.number(),
    budget: z.number(),
    finca_id: z.string(),
    lote_plantation_control_id: z.string(),
    active_closure: z.boolean(),
    weekly_plan_id: z.string(),
    slots: z.number(),
    lote: z.string(),
    minimum_slots: z.number(),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    start_time: z.string().nullable(),
    end_time: z.string().nullable(),
    insumos: z.array(TaskInsumoSchema),
    use_dron: z.boolean(),
    weekly_plan_change: z.boolean(),
    extraordinary: z.boolean(),
    operation_date: z.string().nullable()
});

export const DraftTaskWeeklyPlanSchema = TaskWeeklyPlanSchema.pick({ weekly_plan_id: true, budget: true, hours: true, extraordinary: true, slots: true, start_date: true, end_date: true, start_time: true, end_time: true, operation_date: true }).extend({
    tarea_id: z.string(),
    workers_quantity: z.string(),
    lote_id: z.string(),
})

export const TaskWeeklyPlanDetailsSchema = TaskWeeklyPlanSchema.pick({ task: true, lote: true, week: true }).extend({
    finca: z.string(),
    aplication_week: z.number(),
    start_date: z.union([z.string(), z.null()]),
    end_date: z.union([z.string(), z.null()]),
    hours: z.number(),
    real_hours: z.union([z.number(), z.null()]),
    slots: z.number(),
    total_employees: z.number(),
    employees: z.array(
        z.object({
            name: z.string(),
            code: z.string(),
        })
    ),
    closures: z.array(
        z.object({
            start_date: z.string(),
            end_date: z.string().nullable(),
        })
    ),
    insumos: z.array(TaskInsumoSchema),
    use_dron: z.boolean(),
    passed_hours: z.number().nullable()
})

export const TaskWeeklyPlanWithNoOperationDateSchema = TaskWeeklyPlanSchema.pick({ id: true, task: true, lote: true }).extend({
    finca: z.string(),
    bg_color: z.string(),
    group: z.string()
});

export const TaskWeeklyPlanForCalendarSchema = TaskWeeklyPlanSchema.pick({ id: true, task: true, lote: true, cdp: true }).extend({
    title: z.string(),
    start: z.string(),
    end: z.string(),
    backgroundColor: z.string(),
    editable: z.boolean(),
    finca: z.string()
});

export const TasksWeeklyPlanForCalendarSchema = z.object({
    data: z.array(TaskWeeklyPlanForCalendarSchema),
    initial_date: z.string(),
    tasks_without_operation_date: z.number(),
    tasks_with_operation_date: z.number(),
});

export const TasksWeeklyPlanWithNoOperationDateSchema = z.object({
    data: z.array(TaskWeeklyPlanWithNoOperationDateSchema)
});

export const WeeklyEmployeeAssignmentSchema = z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
    group: z.string()
});

export const WeeklyEmployeeAssignmentsSchema = z.object({
    statusCode: z.number(),
    data: z.array(WeeklyEmployeeAssignmentSchema)
});


export const TasksWeeklyPlanSchema = z.object({
    finca: z.string(),
    week: z.number(),
    lote: z.string(),
    data: z.array(TaskWeeklyPlanSchema),
});


export const TaskWeeklyPlanSummarySchema = z.object({
    id: z.number(),
    calendar_week: z.number(),
    task: z.string(),
    hours: z.number(),
    real_hours: z.number().nullable(),
    aplication_week: z.number(),
    performance: z.number().nullable(),
    closed: z.boolean(),
    insumos: z.array(TaskInsumoSchema),
});

export const FincaGroupSchema = z.object({
    id: z.number(),
    code: z.string(),
    lote: z.string(),
    finca: z.string()
});

export const FincaGroupsSchema = ApiResponseSchema.extend({
    data: z.array(FincaGroupSchema)
});