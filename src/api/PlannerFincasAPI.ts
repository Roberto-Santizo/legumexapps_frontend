import { DraftWeeklyPlanSchema, DraftWeeklyPlansSchema, TaskPlantationControlEditSchema } from "@/schemas/plannerFincasSchemas";
import { DraftTaskPlantationControl, DraftWeeklyPlan, TaskPlantationControl } from "../types";
import { ApiResponseSchema } from "@/schemas/httpRequestsSchemas";
import { isAxiosError } from "axios";
import clienteAxios from "@/config/axios";

export async function getDraftWeeklyPlans({ page, limit }: { page?: number, limit?: number }) {
    try {
        const url = `/api/seeding-plan?page=${page ?? ''}&limit=${limit ?? ''}`;

        const response = await clienteAxios(url);

        const result = DraftWeeklyPlansSchema.safeParse(response.data);
        if (result.success) {
            return result.data;
        }
    } catch (error: unknown) {
        throw error;
    }
}

export async function getDraftWeeklyPlanById( {id, filter}: {id: DraftWeeklyPlan['data']['id'], filter: string}) {
    try {
        const url = `/api/seeding-plan/${id}?cdp=${filter}`;
        const response = await clienteAxios(url);
        const result = DraftWeeklyPlanSchema.safeParse(response.data);
        console.log(response.data);
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
        const result = ApiResponseSchema.safeParse(response.data);
        if (result.success) {
            return result.data.message;
        } else {
            throw new Error("Hubo un error");
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
    }
}