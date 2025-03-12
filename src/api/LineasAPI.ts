import clienteAxios from "@/config/axios";
import { z } from "zod";

export const LineaSchema = z.object({
    id: z.string(),
    code: z.string(),
    total_persons: z.number()
});

export const LineaDetailSchema = z.object({
    data: LineaSchema
});

export const LineasPaginatedSchema = z.object({
    data: z.array(LineaSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

export type LineasPaginated = z.infer<typeof LineasPaginatedSchema>
export type Linea = z.infer<typeof LineaSchema>

export async function getLineasPaginated(page: number): Promise<LineasPaginated> {
    try {
        const url = `/api/lines?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = LineasPaginatedSchema.safeParse(data);
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

export async function getLineaById(id: Linea['id']): Promise<Linea> {
    try {
        const url = `/api/lines/${id}`;
        const { data } = await clienteAxios(url);
        const result = LineaDetailSchema.safeParse(data);
        if (result.success) {
            return result.data.data;
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export type DraftLinea = {
    code: string,
    total_persons: number
}

export async function createLinea(data: DraftLinea) {
    try {
        const url = '/api/lines';
        await clienteAxios.post(url, data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateLinea(data: DraftLinea, id : Linea['id']) {
    try {
        const url = `/api/lines/${id}`;
        await clienteAxios.put(url, data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}