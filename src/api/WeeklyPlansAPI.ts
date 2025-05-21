import clienteAxios from "@/config/axios";
import { SummaryWeeklyPlan, WeeklyPlan, WeeklyPlansPaginate } from "@/types";
import { ReportSchema } from "@/utils/reports-schema";
import { SummaryWeeklyPlanSchema, WeeklyPlansPaginateSchema } from "@/utils/weekly_plans-schema";
import { downloadBase64File } from "@/helpers";
import { FiltersPlanSemanalType } from "@/views/agricola/planes-semanales/IndexPlanSemanal";

export async function createPlan(file: File[]): Promise<void | string[]> {
    try {
        const url = '/api/plans';
        const formData = new FormData();
        formData.append("file", file[0]);

        await clienteAxios.post(url, formData);
    } catch (error: any) {
        return error.response.data.message;
    }
}

export async function getWeeklyPlans({ page, filters, paginated }: { page: number, filters: FiltersPlanSemanalType, paginated: string }): Promise<WeeklyPlansPaginate> {
    try {
        const url = `/api/plans?paginated=${paginated}&page=${page}&finca_id=${filters.finca_id}&week=${filters.week}&year=${filters.year}`;
        const { data } = await clienteAxios(url);
        const result = WeeklyPlansPaginateSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error('Error datos no válidos');
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

export async function getPlanById(id: WeeklyPlan['id']): Promise<SummaryWeeklyPlan> {
    try {
        const url = `/api/plans/${id}`;
        const { data } = await clienteAxios(url);
        const result = SummaryWeeklyPlanSchema.safeParse(data);

        if (result.success) {
            return result.data
        } else {
            throw new Error('Los datos no son validos');
        }
    } catch (error) {
        throw error;
    }
}

export async function downloadWeeklyPlanReport(weekly_plans_ids: WeeklyPlan['id'][]): Promise<void> {
    try {
        const url = '/api/report/plans';
        const { data } = await clienteAxios.post(url, {
            data: weekly_plans_ids
        });
        const result = ReportSchema.safeParse(data);
        if (result.success) {
            downloadBase64File(result.data.file, result.data.fileName)
        } else {
            throw new Error('Información no válida');
        }
    } catch (error) {
        throw error;
    }
}

export async function downloadReportInsumos(weekly_plan_id: WeeklyPlan['id']): Promise<void> {
    try {
        const url = `/api/report/insumos/${weekly_plan_id}`;
        const { data } = await clienteAxios(url);
        const result = ReportSchema.safeParse(data);
        if (result.success) {
            downloadBase64File(result.data.file, result.data.fileName)
        } else {
            throw new Error('Información no válida');
        }
    } catch (error) {
        throw error;
    }
}