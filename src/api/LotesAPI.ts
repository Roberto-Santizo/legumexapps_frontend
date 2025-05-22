import { z } from "zod";
import { CDP } from "@/types";
import { CDPsSchema } from "@/utils/plantation-schema";
import { DraftLote } from "@/views/agricola/lotes/CreateLote";
import { isAxiosError } from "axios";
import { FiltersLotesType } from "@/views/agricola/lotes/IndexLotes";
import clienteAxios from "@/config/axios";

export async function createLote(draftlote: DraftLote) {
    try {
        const url = '/api/lotes';
        const { data } = await clienteAxios.post<string>(url, draftlote);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export const LoteSchema = z.object({
    id: z.string(),
    name: z.string(),
    finca: z.string(),
    cdp: z.string()
});

export type Lote = z.infer<typeof LoteSchema>

export const LotesPaginateSchema = z.object({
    data: z.array(LoteSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    }).optional(),
});

export type PaginatedLotes = z.infer<typeof LotesPaginateSchema>


export async function getLotes({ page, filters, paginated }: { page: number, filters: FiltersLotesType, paginated: string }): Promise<PaginatedLotes> {
    try {
        const url = `/api/lotes?paginated=${paginated}&page=${page}&name=${filters.name}&cdp=${filters.cdp}&finca_id=${filters.finca_id}`;
        const { data } = await clienteAxios(url)
        const result = LotesPaginateSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error('Información no válida');
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}


export async function getAllCdpsByLoteId(id: Lote['id']): Promise<CDP[]> {
    try {
        const url = `/api/lotes/${id}`;
        const { data } = await clienteAxios(url);
        const result = CDPsSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const InsumoSchema = z.object({
    id: z.string(),
    name: z.string(),
    assigned_quantity: z.number(),
    measure: z.string(),
    used_quantity: z.number().nullable(),
});

export const TaskSchema = z.object({
    id: z.number(),
    calendar_week: z.number(),
    task: z.string(),
    hours: z.number(),
    real_hours: z.number().nullable(),
    aplication_week: z.number(),
    performance: z.number().nullable(),
    closed: z.boolean(),
    insumos: z.array(InsumoSchema),
});

export const DataLoteSchema = z.object({
    lote: z.string(),
    cdp: z.string(),
    start_date_cdp: z.string(),
    end_date_cdp: z.string().nullable()
});

export const DataSchema = z.record(z.array(TaskSchema));

export type TaskCDP = z.infer<typeof TaskSchema>;

export async function updateLotes(file: File[]) {
    try {
        const url = '/api/lotes-all/update';
        const formData = new FormData();
        formData.append("file", file[0]);
        const { data } = await clienteAxios.post<string>(url, formData);
        return data;
    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}
