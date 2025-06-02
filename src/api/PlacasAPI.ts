import clienteAxios from "@/config/axios";
import { z } from "zod";
import { isAxiosError } from "axios";

export const PlacaSchema = z.object({
    id: z.string(),
    name: z.string(),
    carrier: z.string()
})

export const PlacasPaginatedSchema = z.object({
    data: z.array(PlacaSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
})

export const PlacasSchema = z.object({
    data: z.array(PlacaSchema)
})

export type Placa = z.infer<typeof PlacaSchema>

export async function getPlacas({page,paginated} : {page: number,paginated:string}) {
    try {
        const url = `/api/plates?paginated=${paginated}&page=${page}`;
        const { data } = await clienteAxios(url);
        const result = PlacasPaginatedSchema.safeParse(data);
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


export type DraftPlaca = {
    name: string,
    carrier_id: string,
}

export async function createPlaca(FormData: DraftPlaca) {
    try {
        const { data } = await clienteAxios.post<string>('/api/plates', FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}