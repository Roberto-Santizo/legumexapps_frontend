import clienteAxios from "@/config/axios";
import { z } from "zod";


export const DronHoursSchema = z.object({
    hours: z.number()
});

export async function getDronHours(): Promise<number> {
    try {
        const url = "/api/dron-hours";
        const { data } = await clienteAxios(url);
        const result = DronHoursSchema.safeParse(data);
        if (result.success) {
            return result.data.hours;
        } else {
            throw new Error("Existe un error al traer las fincas");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

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

export type SummaryEmployeeHours = z.infer<typeof SummaryHoursEmployeeSchema>
export type SummaryEmployeesHours = z.infer<typeof SummaryHoursEmployeesSchema>

export async function getSummaryHoursEmployees(): Promise<SummaryEmployeeHours[]> {
    try {
        const url = "/api/summary-hours-employees";
        const { data } = await clienteAxios(url);
        const result = SummaryHoursEmployeesSchema.safeParse(data);
        if (result.success) {
            return result.data.data;
        } else {
            throw new Error("Existe un error al traer las fincas");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const TaskInProgressSchema = z.object({
    id: z.string(),
    task: z.string(),
    finca: z.string(),
    lote: z.string(),
    week: z.number(),
    assigned_employees: z.number(),
    total_employees: z.number().nullable(),
    paused: z.boolean(),
    has_insumos: z.boolean()
});

export const TasksInProgressSchema = z.object({
    data: z.array(TaskInProgressSchema)
});

export type TaskInProgress = z.infer<typeof TaskInProgressSchema>

export async function getTasksInProgress(): Promise<TaskInProgress[]> {
    try {
        const url = "/api/tasks-in-progress";
        const { data } = await clienteAxios(url);
        const result = TasksInProgressSchema.safeParse(data);
        if (result.success) {
            return result.data.data;
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

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

export type FinishedTask = z.infer<typeof FinishedTaskSchema>;

export async function getTasksFinished(): Promise<FinishedTask[]> {
    try {
        const url = "/api/finished-tasks";
        const { data } = await clienteAxios(url);
        const result = FinishedTasksSchema.safeParse(data);
        if (result.success) {
            return result.data.data;
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

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

export type SummaryFincaTasks = z.infer<typeof SummaryFincaTasksSchema>

export async function getFinishedTasksByFinca(): Promise<SummaryFincaTasks[]> {
    try {
        const url = "/api/finished-total-tasks-finca";
        const { data } = await clienteAxios(url);
        const result = FinishedTasksByFincaSchema.safeParse(data);
        if (result.success) {
            return result.data.data;
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const TaskCropInProgressSchema = z.object({
    id: z.string(),
    task: z.string(),
    finca: z.string(),
    lote: z.string(),
    week: z.number(),
    assigned_employees: z.number(),
});

export const TasksCropsInProgressSchema = z.object({
    data: z.array(TaskCropInProgressSchema)
});

export type TaskCropInProgress = z.infer<typeof TaskCropInProgressSchema>


export async function getTasksCropInProgress(): Promise<TaskCropInProgress[]> {
    try {
        const url = "/api/tasks-crops-in-progress";
        const { data } = await clienteAxios(url);
        const result = TasksCropsInProgressSchema.safeParse(data);
        if (result.success) {
            return result.data.data;
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getTasksCropFinished(): Promise<FinishedTask[]> {
    try {
        const url = "/api/finished-tasks-crop";
        const { data } = await clienteAxios(url);
        const result = FinishedTasksSchema.safeParse(data);
        if (result.success) {
            return result.data.data;
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}