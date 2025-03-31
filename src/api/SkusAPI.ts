import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { DraftSku } from "views/produccion/sku/CreateSKU";
import { z } from "zod";

export const SKUSchema = z.object({
    id: z.string(),
    code: z.string(),
    product_name: z.string(),
    presentation: z.string().nullable(),
    client_name: z.string()
});

export const SkusPaginatedSchema = z.object({
    data: z.array(SKUSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

export type SKU = z.infer<typeof SKUSchema>;
export type SkusPaginated = z.infer<typeof SkusPaginatedSchema>

export async function getSkusPaginated(page: number): Promise<SkusPaginated> {
    try {
        const url = `/api/sku?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = SkusPaginatedSchema.safeParse(data);
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

export const SKUSelectSchema = z.object({
    value: z.string(),
    label: z.string(),
});

export const SKUSSelectSchema = z.object({
    data: z.array(SKUSelectSchema)
});

export type SKUSelect = z.infer<typeof SKUSelectSchema>

export async function getAllSkus(): Promise<SKUSelect[]> {
    try {
        const url = '/api/sku-all';
        const { data } = await clienteAxios(url);
        const result = SKUSSelectSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function createSKU(FormData: DraftSku) {
    try {
        const url = '/api/sku';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.msg);
        }
    }
}