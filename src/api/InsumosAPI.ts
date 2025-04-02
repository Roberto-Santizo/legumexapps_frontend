import clienteAxios from "@/config/axios";
import { DraftInsumo, Insumo } from "@/types";
import { InsumosSchema } from "@/utils/insumos-schema";
import { z } from "zod";

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

export const InsumoSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    measure: z.string()
});

export const AllInsumosSchema = z.object({
    data: z.array(InsumoSchema)
});


export async function getAllInsumos() : Promise<Insumo[]> {
    try {
        const url = '/api/insumos-all';
        const { data } = await clienteAxios(url);
        const result = AllInsumosSchema.safeParse(data);
        if(result.success){
            return result.data.data
        }else{
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}