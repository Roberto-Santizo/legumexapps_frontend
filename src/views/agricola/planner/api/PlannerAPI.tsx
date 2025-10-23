import { ApiResponseSchema } from "@/schemas/httpRequestsSchemas";
import { isAxiosError } from "axios";
import { DraftWeeklyPlansSchema } from "@/schemas/plannerFincasSchemas";
import clienteAxios from "@/config/axios";
import { DraftWeeklyPlan } from "@/types/index";

export async function createPlan(file: File) {
    try {
        const url = '/api/seeding-plan';
        const formData = new FormData();
        formData.append('file', file);
        const response = await clienteAxios.post(url, formData);
        const result = ApiResponseSchema.safeParse(response.data);

        if (result.success) {
            return result.data.message;
        } else {
            throw new Error('Hubo un error');
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Error no controlado");
    }
}

export async function getDraftWeeklyPlans({ page, limit, filters }: { page?: number, limit?: number, filters: Record<string, any> }) {
    try {
        const url = `/api/seeding-plan?page=${page ?? ''}&limit=${limit ?? ''}`;

        const response = await clienteAxios(url, {
            params: {
                ...filters
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

export async function deleteDraftWeeklyPlan(id: DraftWeeklyPlan['data']['id']) {
    try {
        const url = `/api/seeding-plan/${id}`;
        const response = await clienteAxios.delete(url);

        const result = ApiResponseSchema.safeParse(response.data);
        if (result.success) {
            return result.data.message;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }

        throw new Error("Error no controlado");
    }
}