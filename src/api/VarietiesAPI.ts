import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { z } from "zod";


export const VarietySchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const VarietiesSchema = z.object({
    data: z.array(VarietySchema)
});

export const VarietiesPaginateSchema = z.object({
    data: z.array(VarietySchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    }).optional(),
});

export type VarietiesPaginate = z.infer<typeof VarietiesPaginateSchema>
export type Variety = z.infer<typeof VarietySchema>
export type DraftVariety = Omit<Variety, 'id'>


export async function createVariety(FormData: DraftVariety) {
    try {
        const url = '/api/variety-products';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.data.msg) {
                throw new Error(error.response.data.msg);
            } else if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            }
        }
    }
}

export async function getVariedades({ page, paginated }: { page: number, paginated: string }) {
    try {
        const url = `/api/variety-products?paginated=${paginated}&page=${page}`;
        const { data } = await clienteAxios(url);
        const result = VarietiesPaginateSchema.safeParse(data);

        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}
