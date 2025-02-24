import clienteAxios from "@/config/axios";
import { DraftInsumo } from "@/types";
import { InsumosSchema } from "@/utils/insumos-schema";

export async function createInsumo(data: DraftInsumo): Promise<void | string[]> {
    try {
        const url = `/api/insumos`;
        await clienteAxios.post(url, data);
    } catch (error: any) {
        return Object.values(error.response.data.errors);
    }
}

export async function uploadInsumos(file: File[]) : Promise<void | string[]> {
    try {
        const url = "/api/insumos/upload";
        const formData = new FormData();
        formData.append("file", file[0]);
        await clienteAxios.post(url, formData);
    } catch (error: any) {
        return error.response.data.message;
    }
}

export async function getPaginatedInsumos(page: number) {
    try {
        const url = `/api/insumos?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = InsumosSchema.safeParse(data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        throw error;
    }
}