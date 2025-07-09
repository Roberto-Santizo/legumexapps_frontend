import clienteAxios from "@/config/axios";
import { WeeklyPlanTasksOperationDateSchema, WeeklyProductionPlanEventsShema, WeeklyProductionPlansSchema, WeeklyProductionPlanSummarySchema, WeeklyProductionPlanTasksSchema } from "@/utils/weeklyProductionPlanSchemas";
import { isAxiosError } from "axios";
import { WeeklyProductionPlan } from "types/weeklyProductionPlanTypes";
import { Linea } from "./LineasAPI";
import { ReportSchema } from "@/utils/reports-schema";
import { downloadBase64File } from "@/helpers";
import { TaskProductionUnscheduledFilters, TasksWithOperationDateFilters } from "@/stores/planificationProductionSlice";


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

export async function createAssigmentsProductionTasks(file : File[]) {
    try {
        const url = `/api/weekly-production-plans/assign`;
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

export async function getTasksNoOperationDate({ id, filters }: { id: WeeklyProductionPlan['id'], filters: TaskProductionUnscheduledFilters }) {
    try {
        const url = `/api/weekly-production-plans/tasks-no-operation-date/${id}?sku=${filters.sku}&line=${filters.line}`;
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

export async function getWeeklyProductionPlanEvents(id: WeeklyProductionPlan['id']) {
    try {
        const url = `/api/weekly-production-plans/events-for-calendar/${id}`;
        const { data } = await clienteAxios(url);
        const result = WeeklyProductionPlanEventsShema.safeParse(data);

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

export async function getTasksOperationDate({ id, date, filters }: { id: WeeklyProductionPlan['id'], date: string, filters: TasksWithOperationDateFilters }) {
    try {
        const url = `/api/weekly-production-plans/tasks/programed/${id}?date=${date}&line=${filters.line}&status=${filters.status}&sku=${filters.sku}`;
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
            const errores = error.response?.data?.plan_errors;
            throw new Error(`${errores ? '\n' + errores.join('\n') : ''}`);
        }

        throw new Error("Error desconocido");
    }
}

export async function downloadPlanillaProduction({ plan_id, line_id }: { plan_id: WeeklyProductionPlan['id'], line_id: Linea['id'] }) {
    try {
        const url = `/api/report-production/${plan_id}/${line_id}`;
        const { data } = await clienteAxios.get(url);
        const result = ReportSchema.safeParse(data);
        if (result.success) {
            downloadBase64File(result.data.file, result.data.fileName)
        } else {
            throw new Error('Información no válida');
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

