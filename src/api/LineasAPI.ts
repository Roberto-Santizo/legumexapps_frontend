import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { DraftLinea } from "views/produccion/lineas/CrearLinea";
import { z } from "zod";

export const LineaSchema = z.object({
    id: z.string(),
    code: z.string(),
    total_persons: z.number(),
    name: z.string(),
    shift:z.string()
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

export const LineaSelectSchema = z.object({
    value: z.string(),
    label: z.string()
});

export const LineasSelectSchema = z.object({
    data: z.array(LineaSelectSchema)
});

export type LineaSelect = z.infer<typeof LineaSelectSchema>


export async function getAllLines(): Promise<LineaSelect[]> {
    try {
        const url = '/api/lines-all';
        const { data } = await clienteAxios(url);
        const result = LineasSelectSchema.safeParse(data);
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



export async function createLinea(FormData: DraftLinea) {
    try {
        const url = '/api/lines';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function updateLinea(FormData: DraftLinea, id: Linea['id']) {
    try {
        const url = `/api/lines/${id}`;
        const { data } = await clienteAxios.put<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}