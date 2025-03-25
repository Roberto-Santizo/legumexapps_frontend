import clienteAxios from "@/config/axios";
import { Line } from "recharts";
import { z } from 'zod';
import { SKUSchema } from "./SkusAPI";
import { DraftChangePosition } from "@/components/ModalChangeEmployee";
import { DraftPerformance } from "@/components/ModalTomaRendimientoProduccion";
import { DraftCloseTask } from "@/components/ModalCierreTareaProduccion";
import { DraftTaskProduction } from "@/components/ModalNuevaTareaProduccion";
import { Linea } from "./LineasAPI";
import { DraftNewTaskProduction } from "@/components/ModalCrearTareaProduccion";
import { isAxiosError } from "axios";

const WeeklyPlanProductionPlanSchema = z.object({
    id: z.string(),
    week: z.number(),
    year: z.number(),
    completed: z.boolean()
});

export type WeeklyPlanProductionPlan = z.infer<typeof WeeklyPlanProductionPlanSchema>

const PaginatedWeeklyProductionPlansSchema = z.object({
    data: z.array(WeeklyPlanProductionPlanSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })

});

export type PaginatedWeeklyProductionPlans = z.infer<typeof PaginatedWeeklyProductionPlansSchema>

export async function getPaginatedWeeklyProductionPlans(page: number): Promise<PaginatedWeeklyProductionPlans> {
    try {
        const url = `/api/weekly_production_plan?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = PaginatedWeeklyProductionPlansSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const LineWeeklyPlanSchema = z.object({
    id: z.string(),
    line: z.string(),
    status: z.boolean(),
    total_employees: z.number(),
    assigned_employees: z.number()
});

export const LinesWeeklyPlanSchema = z.object({
    data: z.array(LineWeeklyPlanSchema)
});

export type LineWeeklyPlan = z.infer<typeof LineWeeklyPlanSchema>

export async function getWeeklyPlanDetails(id: WeeklyPlanProductionPlan['id']): Promise<LineWeeklyPlan[]> {
    try {
        const url = `/api/weekly_production_plan/${id}`;
        const { data } = await clienteAxios(url);
        const result = LinesWeeklyPlanSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const TaskProductionSchema = z.object({
    id: z.string(),
    line: z.string(),
    sku: z.string(),
    total_tarimas: z.number(),
    finished_tarimas: z.number(),
    operation_date: z.string(),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    hours: z.number(),
    total_hours: z.number(),
    total_employees: z.number(),
    total_in_employees: z.number(),
    priority: z.number(),
    available: z.boolean()
});

export const TasksProductionSchema = z.object({
    data: z.array(TaskProductionSchema)
});

export type TaskProduction = z.infer<typeof TaskProductionSchema>

export async function getWeeklyPlanLineDetails(line_id: Line['id'], weekly_production_plan_id: WeeklyPlanProductionPlan['id'], date: string): Promise<TaskProduction[]> {
    try {
        const url = `/api/weekly_production_plan/details/${weekly_production_plan_id}/${line_id}?date=${date}`;
        const { data } = await clienteAxios(url);
        console.log(date);
        const result = TasksProductionSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const EmployeeTaskProductionSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    position: z.string(),
    column_id: z.string()
});

export const TaskProductionDetailSchema = z.object({
    id: z.string(),
    line: z.string(),
    operation_date: z.string(),
    total_tarimas: z.number(),
    sku: SKUSchema,
    employees: z.array(EmployeeTaskProductionSchema),
});

export type EmployeeProduction = z.infer<typeof EmployeeTaskProductionSchema>
export type TaskProductionDetails = z.infer<typeof TaskProductionDetailSchema>

export async function getTaskProductionDetails(id: TaskProduction['id']): Promise<TaskProductionDetails> {
    try {
        const url = `/api/task_production_plan/${id}`;
        const { data } = await clienteAxios(url);
        const result = TaskProductionDetailSchema.safeParse(data.data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const EmployeeComodinSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    position: z.string(),
    column_id: z.string()
});

export const EmployeesComodinesSchema = z.object({
    data: z.array(EmployeeComodinSchema)
});

export type EmployeeComodin = z.infer<typeof EmployeeComodinSchema>

export async function getComodines(): Promise<EmployeeComodin[]> {
    try {
        const url = '/api/employees-comodines';
        const { data } = await clienteAxios(url);
        const result = EmployeesComodinesSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createProductionPlan(file: File[]) {
    try {
        const url = '/api/weekly_production_plan';
        const formData = new FormData();
        formData.append("file", file[0]);

        await clienteAxios.post(url, formData);
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

export async function createAssigmentsProductionTasks(file: File[], id: LineWeeklyPlan['id']) {
    try {
        const url = `/api/weekly_production_plan/assign/${id}`;
        const formData = new FormData();
        formData.append("file", file[0]);

        await clienteAxios.post(url, formData);
    } catch (error: any) {
        return error.response.data.message;
    }
}

export async function changePosition(data: DraftChangePosition) {
    try {
        const url = '/api/tasks_production_plan/change-assignment';
        await clienteAxios.post(url, data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function startTaskProduction(id: TaskProduction['id']) {
    try {
        const url = `/api/tasks_production_plan/${id}/start`;
        await clienteAxios.patch(url);
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export const AssignedEmployeeTaskProductionSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    position: z.string()
});

export const TaskProductionInProgressSchema = z.object({
    data: z.object({
        line: z.string(),
        sku: z.string(),
        start_date: z.string(),
        biometric_hours: z.number(),
        total_hours: z.number(),
        line_hours: z.number(),
        performance_hours: z.number(),
        employees: z.array(AssignedEmployeeTaskProductionSchema),
        last_take: z.string(),
        last_finished_tarimas: z.number()
    })
})

export type TaskProductionInProgress = z.infer<typeof TaskProductionInProgressSchema>


export async function getTaskProductionInProgressDetail(id: TaskProduction['id']): Promise<TaskProductionInProgress> {
    try {
        const url = `/api/tasks_production_plan/details/${id}`;
        const { data } = await clienteAxios(url);
        console.log(data);
        const result = TaskProductionInProgressSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function createTaskProductionPerformance(id: TaskProduction['id'], data: DraftPerformance) {
    try {
        const url = `/api/tasks_production_plan/${id}/performance`;
        await clienteAxios.post(url, data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function closeTaskProduction(id: TaskProduction['id'], data: DraftCloseTask) {
    try {
        const url = `/api/tasks_production_plan/${id}/end`;
        await clienteAxios.patch(url, data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createNewTaskProduction(data: DraftNewTaskProduction) {
    try {
        const url = '/api/tasks_production_plan/new-task';
        await clienteAxios.post(url, data);
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.msg)
        }
    }
}

export async function createTaskProduction(data: DraftTaskProduction) {
    try {
        const url = '/api/task_production_plan';
        await clienteAxios.post(url, data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function changeTasksPriority(data: string[]) {
    try {
        const url = '/api/tasks_production_plan/change-priority';
        await clienteAxios.put(url, {
            data: data
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const TaskForCalendarSchema = z.object({
    id: z.string(),
    title: z.string(),
    start: z.string(),
    priority: z.string(),
    backgroundColor: z.string(),
    editable: z.boolean()
});

export const TasksForCalendarSchema = z.object({
    data: z.array(TaskForCalendarSchema)
});

export type TaskForCalendar = z.infer<typeof TaskForCalendarSchema>;

export async function getAllTasksForCalendar(id: WeeklyPlanProductionPlan['id']): Promise<TaskForCalendar[]> {
    try {
        const url = `/api/weekly_production_plan/details/${id}`;
        const { data } = await clienteAxios(url);
        const result = TasksForCalendarSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateTaskProductionOperationDate(id: TaskProduction['id'], date: string) {
    try {
        const url = `/api/tasks_production_plan/change-operation-date/${id}`;
        await clienteAxios.patch(url, {
            date: date
        });
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.msg)
        }
    }
}

export const TaskByDateSchema = z.object({
    id: z.string(),
    line: z.string(),
    sku: z.string(),
    total_tarimas: z.number(),
    finished_tarimas: z.number(),
    operation_date: z.string(),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    hours: z.number(),
    priority: z.number()
});

export const TasksByDateSchema = z.object({
    data: z.array(TaskByDateSchema)
})

export type TaskByDate = z.infer<typeof TaskByDateSchema>;

export async function getTasksProductionByDate(id: WeeklyPlanProductionPlan['id'], date: string): Promise<TaskByDate[]> {
    try {
        const url = `api/weekly_production_plan/details-by-date/${id}?date=${date}`;
        const { data } = await clienteAxios(url);
        const result = TasksByDateSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const TaskByLineSchema = z.object({
    id: z.string(),
    line: z.string(),
    sku: z.string(),
    total_tarimas: z.number(),
    finished_tarimas: z.number(),
    operation_date: z.string(),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    hours: z.number(),
    total_hours: z.number(),
    total_in_employees: z.number(),
    total_employees: z.number(),
    priority: z.number(),
    available: z.boolean(),
});

export const TasksByLineSchema = z.object({
    data: z.array(TaskByLineSchema)
});

export type TaskByLine = z.infer<typeof TaskByLineSchema>;

export async function getTasksByLineId(plan_id: WeeklyPlanProductionPlan['id'], line_id: Linea['id']): Promise<TaskByLine[]> {
    try {
        const url = `/api/weekly_production_plan/details/${plan_id}/${line_id}`;
        const { data } = await clienteAxios(url);
        const result = TasksByLineSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

