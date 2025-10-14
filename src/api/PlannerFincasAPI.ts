import { DraftWeeklyPlanSchema, DraftWeeklyPlansSchema, TaskPlantationControlEditSchema } from "@/schemas/plannerFincasSchemas";
import { DraftTaskPlantationControl, DraftWeeklyPlan, TaskPlantationControl } from "../types";
import clienteAxios from "@/config/axios";

export async function getDraftWeeklyPlans({ page, limit }: { page: number, limit: number }) {
    try {
        const url = '/api/seeding-plan';
        const response = await clienteAxios(url, {
            params: {
                page: page + 1,
                limit
            }
        });

        const result = DraftWeeklyPlansSchema.safeParse(response.data);
        if (result.success) {
            return result.data;
        }
    } catch (error: unknown) {
        throw error;
    }
}

export async function getDraftWeeklyPlanById(id: DraftWeeklyPlan['data']['id']) {
    try {
        const url = `/api/seeding-plan/${id}`;
        const response = await clienteAxios(url);
        const result = DraftWeeklyPlanSchema.safeParse(response.data);
        if (result.success) {
            return result.data.data;
        } else {
            throw new Error('Hubo un error con el tipado');
        }
    } catch (error: unknown) {
        throw error;
    }
}

export async function getTaskWeeklyPlanDraftById(id: TaskPlantationControl['id']) {
    try {
        const url = `/api/draft-task-weekly-plans/${id}`;
        const response = await clienteAxios(url);
        const result = TaskPlantationControlEditSchema.safeParse(response.data);

        if (result.success) {
            return result.data.data;
        } else {
            throw new Error("Hubo un error");
        }
    } catch (error: unknown) {
        throw error;
    }
}

export async function UpdateTaskWeeklyPlanDraft({ id, data }: { id: TaskPlantationControl['id'], data: DraftTaskPlantationControl }) {
    try {
        const url = `/api/draft-task-weekly-plans/${id}`;
        const response = await clienteAxios.put(url, data);
        console.log(response);
    } catch (error) {
        
    }
}