import { z } from "zod";
import { CDP } from "@/types";
import { CDPsSchema } from "@/utils/plantation-schema";
import { DraftLote } from "@/views/agricola/lotes/CreateLote";
import { isAxiosError } from "axios";
import { FiltersLotesType } from "@/views/agricola/lotes/IndexLotes";
import { Lote } from "types/lotesType";
import { TaskWeeklyPlanSummarySchema } from "@/utils/taskWeeklyPlanSchemas";
import clienteAxios from "@/config/axios";
import { LotesSchema } from "@/utils/lotesSchemas";

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

export async function getLotes({ page, filters, paginated }: { page: number, filters: FiltersLotesType, paginated: string }) {
    try {
        const url = `/api/lotes?paginated=${paginated}&page=${page}&name=${filters.name}&cdp=${filters.cdp}&finca_id=${filters.finca_id}`;
        const { data } = await clienteAxios(url)
        const result = LotesSchema.safeParse(data);
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


export const DataLoteSchema = z.object({
    lote: z.string(),
    cdp: z.string(),
    start_date_cdp: z.string(),
    end_date_cdp: z.string().nullable()
});

export const DataSchema = z.record(z.array(TaskWeeklyPlanSummarySchema));

export type TaskCDP = z.infer<typeof TaskWeeklyPlanSummarySchema>;

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
