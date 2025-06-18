import clienteAxios from "@/config/axios";
import { WeeklyPlanTasksOperationDateSchema, WeeklyProductionPlansSchema, WeeklyProductionPlanSummarySchema, WeeklyProductionPlanTasksSchema } from "@/utils/weeklyProductionPlanSchemas";
import { isAxiosError } from "axios";
import { LineWeeklyProductionPlan, WeeklyProductionPlan } from "types/weeklyProductionPlanTypes";


export async function getWeeklyProductionPlans({ page, paginated }: { page: number, paginated: string }) {
    try {
        const url = `/api/weekly-production-plans?paginated${paginated}&page=${page}`;
        const { data } = await clienteAxios(url);
        const result = WeeklyProductionPlansSchema.safeParse(data);
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

export async function getWeeklyPlanDetails(id: WeeklyProductionPlan['id']) {
    try {
        const url = `/api/weekly-production-plans/${id}`;
        const { data } = await clienteAxios(url);
        const result = WeeklyProductionPlanSummarySchema.safeParse(data);
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

export async function createAssigmentsProductionTasks({ file, id }: { file: File[], id: LineWeeklyProductionPlan['id'] }) {
    try {
        const url = `/api/weekly-production-plans/assign/${id}`;
        const formData = new FormData();
        formData.append("file", file[0]);

        const { data } = await clienteAxios.post<string>(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function getAllTasksWeeklyProductionPlan(id: WeeklyProductionPlan['id']) {
    try {
        const url = `/api/weekly-production-plans/all-tasks/${id}`;
        const { data } = await clienteAxios(url);
        const result = WeeklyProductionPlanTasksSchema.safeParse(data);
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

export async function getTasksOperationDate(date: string) {
    try {
        const url = `/api/weekly-production-plans/tasks/programed?date=${date}`;
        const { data } = await clienteAxios(url);
        const result = WeeklyPlanTasksOperationDateSchema.safeParse(data);
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
        const url = '/api/weekly-production-plans';
        const formData = new FormData();
        formData.append("file", file[0]);

        const { data } = await clienteAxios.post<string>(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

