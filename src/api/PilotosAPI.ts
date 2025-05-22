import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { z } from "zod";

export type DraftPiloto = {
    name: string,
    dpi: string,
    license: string,
    carrier_id: string,
}

export async function createPiloto(FormData : DraftPiloto) {
    try {
        const { data } = await clienteAxios.post<string>('/api/drivers',FormData);
        return data;
    } catch (error) {
        if(isAxiosError(error)){
            if(error.response?.data.msg){
                throw new Error(error.response.data.msg);
            }else if(error.response?.data.errors){
                 throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            }
        }
    }
}

export const PilotoSchema = z.object({
    id: z.string(),
    name: z.string(),
    dpi: z.string().nullable(),
    license: z.string().nullable(),
    carrier: z.string(),
});

export const PilotosPaginatedSchema = z.object({
    data: z.array(PilotoSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    }).optional()
});

export type Piloto = z.infer<typeof PilotoSchema>

export async function getPilotosPaginated(page : number) {
    try {
        const url = `/api/drivers?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = PilotosPaginatedSchema.safeParse(data);
        if(result.success){
            return result.data
        }else{
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

