import clienteAxios from "@/config/axios";
import { FinishedTask, SummaryEmployeeHours, TaskInProgress } from "@/types";
import { DronHoursSchema, FinishedTasksSchema, SummaryHoursEmployeesSchema, TasksInProgressSchema } from "@/utils/dashboard-schema";

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

export async function getTasksInProgress() : Promise<TaskInProgress[]> {
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

export async function getTasksFinished() : Promise<FinishedTask[]> {
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
