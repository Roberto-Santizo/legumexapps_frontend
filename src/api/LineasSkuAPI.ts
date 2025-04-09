import { DraftEditLineSku } from "@/components/modals/ModalEditLineSkuData";
import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { DraftLineaSku } from "views/produccion/lineas_skus/CrearLineaSku";
import { z } from "zod";

export const LineaSKUSchema = z.object({
    id: z.string(),
    line: z.string(),
    sku: z.string(),
    client: z.string(),
    product: z.string(),
    shift: z.string(),
    performance: z.string(),
    accepted_percentage: z.number()
});

export const PaginatedLineasSKUSchema = z.object({
    data: z.array(LineaSKUSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

export type PaginatedLineasSKU = z.infer<typeof PaginatedLineasSKUSchema>;
export type LineaSKU = z.infer<typeof LineaSKUSchema>;

export async function getPaginatedLineasSKU(page: number): Promise<PaginatedLineasSKU> {
    try {
        const url = `/api/lines-skus?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = PaginatedLineasSKUSchema.safeParse(data);
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

export async function createLineaSku(FormData: DraftLineaSku) {
    try {
        const url = '/api/lines-skus';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        throw error;
    }
}

export async function updateLineaSku({ FormData, id }: { FormData: DraftEditLineSku, id: LineaSKU['id'] }) {
    try {
        const url = `/api/lines-skus/${id}`;
        const { data } = await clienteAxios.patch(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}