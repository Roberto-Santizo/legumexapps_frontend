import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { DraftLinea } from "views/produccion/lineas/CrearLinea";
import { z } from "zod";
import { SKU } from "./SkusAPI";

export const PositionSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const LineaSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    shift: z.string(),
    positions: z.array(PositionSchema).optional(),
});

export const LineaDetailSchema = z.object({
    data: LineaSchema
});

export const LineasPaginatedSchema = z.object({
    data: z.array(LineaSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    }).optional()
});

export type LineasPaginated = z.infer<typeof LineasPaginatedSchema>;
export type Linea = z.infer<typeof LineaSchema>;
export type Position = z.infer<typeof PositionSchema>;

export async function getLineas( {page,paginated} : {page: number,paginated:string}): Promise<LineasPaginated> {
    try {
        const url = `/api/lines?paginated=${paginated}&page=${page}`;
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
    label: z.string(),
    performance: z.number().nullable()
});

export const LineasSelectSchema = z.object({
    data: z.array(LineaSelectSchema)
});

export type LineaSelect = z.infer<typeof LineaSelectSchema>

export async function getLinesBySkuId(id: SKU['id']): Promise<LineaSelect[]> {
    try {
        const url = `/api/lines-by-sku/${id}`;
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
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function updatePositionsLine({ file, id }: { file: File[], id: Linea['id'] }) {
    try {
        const url = `/api/lines/update-positions/${id}`;
        const formData = new FormData();
        formData.append("file", file[0]);

        const { data } = await clienteAxios.post<string>(url, formData);
        return data;
    } catch (error: any) {
        return error.response.data.message;
    }
}

export const SkuByLineShema = z.object({
    id: z.string(),
    sku: z.string(),
    sku_description: z.string(),
    start_date: z.string(),
    end_date: z.string(),
});

export const PeformanceByDaySchema = z.object({
    max_value: z.number(),
    details: z.array(SkuByLineShema).nullable(),
    summary: z.object({
        HBiometrico: z.number(),
        HPlan: z.number(),
        HLinea: z.number(),
        HRendimiento: z.number(),
    })
});

export type LinePerformanceByDay = z.infer<typeof PeformanceByDaySchema>;

export async function getLinePerformanceByDay(line_id: Linea['id'], date: string): Promise<LinePerformanceByDay> {
    try {
        const url = `/api/lines/performances-per-day/${line_id}?date=${date}`;
        const { data } = await clienteAxios(url);
        const result = PeformanceByDaySchema.safeParse(data);
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