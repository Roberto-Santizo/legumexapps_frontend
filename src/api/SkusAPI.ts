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
    }).optional()
});

export type SKU = z.infer<typeof SKUSchema>;
export type SkusPaginated = z.infer<typeof SkusPaginatedSchema>

export async function getSkus({ page, paginated }: { page: number, paginated: string }) {
    try {
        const url = `/api/skus?paginated=${paginated}&page=${page}`;
        const { data } = await clienteAxios(url);
        const result = SkusPaginatedSchema.safeParse(data);
        if (result.success) {
            return result.data
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
        const url = '/api/skus';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            } else if (error.response?.data.msg) {
                throw new Error(error.response?.data.msg);
            }
        }
    }
}

export async function uploadSkus(file: File[]) {
    try {
        const url = '/api/skus/upload';
        const formData = new FormData();
        formData.append("file", file[0]);
        const { data } = await clienteAxios.post(url,formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            } else if (error.response?.data.msg) {
                throw new Error(error.response?.data.msg);
            }
        }
    }
}
export async function uploadSkusRecipes(file: File[]) {
    try {
        const url = '/api/skus/upload/recipe';
        const formData = new FormData();
        formData.append("file", file[0]);
        const { data } = await clienteAxios.post(url,formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            } else if (error.response?.data.msg) {
                throw new Error(error.response?.data.msg);
            }
        }
    }
}