import clienteAxios from "@/config/axios";
import { z } from 'zod';

const WeeklyPlanProductionPlanSchema = z.object({
    id: z.string(),
    week: z.number(),
    year: z.number()
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

export const TaskWeeklyProductionPlanSchema = z.object({
    id: z.string(),
    line: z.string(),
});

export const TasksWeeklyProductionPlanSchema = z.object({
    data: z.array(TaskWeeklyProductionPlanSchema)
});

export type TaskWeeklyProductionPlan = z.infer<typeof TaskWeeklyProductionPlanSchema>

export async function getWeeklyPlanDetails(id: WeeklyPlanProductionPlan['id']): Promise<TaskWeeklyProductionPlan[]> {
    try {
        const url = `/api/weekly_production_plan/${id}`;
        const { data } = await clienteAxios(url);
        const result = TasksWeeklyProductionPlanSchema.safeParse(data);
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
        return error.response.data.message;
    }
}