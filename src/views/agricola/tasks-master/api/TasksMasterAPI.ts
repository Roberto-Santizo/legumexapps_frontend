import clienteAxios from "@/config/axios";
import { TasksGuideLineSchema } from "../schemas";
import { TasksMasterFilters } from "../hooks/useTasksMasterFilters";
import { ApiResponseSchema, FileResponseSchema } from "@/schemas/httpRequestsSchemas";
import { isAxiosError } from "axios";
import { DraftMasterTask } from "../types";
import { downloadBase64File } from "@/helpers";

export async function getTasksGuidelines({ page, limit, filters }: { page?: number, limit?: number, filters: TasksMasterFilters }) {
    try {
        const url = '/api/task-guidelines';
        const response = await clienteAxios(url, {
            params: {
                page: page ? page + 1 : null,
                limit,
                ...filters
            }
        });
        const result = TasksGuideLineSchema.safeParse(response.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error("Hubo un error");
        }
    } catch (error: unknown) {
        throw error;
    }
}

export async function uploadTasksGuidelines(file: File) {
    try {
        const url = '/api/task-guidelines/upload';
        const formData = new FormData();
        formData.append('file', file);
        const response = await clienteAxios.post(url, formData);

        const result = ApiResponseSchema.safeParse(response.data);

        if (result.success) {
            return result.data.message
        } else {
            throw new Error("Hubo un error");
        }

    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function createTaskGuideline(data: DraftMasterTask) {
    try {
        const url = '/api/task-guidelines';
        const response = await clienteAxios.post(url, data);
        const result = ApiResponseSchema.safeParse(response.data);

        if (result.success) {
            return result.data.message;
        } else {
            throw new Error('Hubo un error');
        }
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
        throw new Error('');
    }
}

export async function exportTaskGuideline() {
    try {
        const url = '/api/task-guidelines/export';
        const response = await clienteAxios.post(url);
        const result = FileResponseSchema.safeParse(response.data);

        if (result.success) {
            downloadBase64File(result.data.file, result.data.fileName)
        } else {
            throw new Error('Información no válida');
        }
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
        throw new Error('');
    }
}

export async function uploadTasksGuidelinesInsumosRecipe(file: File) {
    try {
        const url = '/api/task-guidelines/upload/insumos-recipes';
        const formData = new FormData();
        formData.append('file', file);
        const response = await clienteAxios.post(url, formData);

        const result = ApiResponseSchema.safeParse(response.data);

        if (result.success) {
            return result.data.message
        } else {
            throw new Error("Hubo un error");
        }

    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
    }
}