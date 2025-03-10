import clienteAxios from "@/config/axios";
import { z } from "zod";

export const TransportistaSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string()
})

export const TransportistasPaginatedSchema = z.object({
    data: z.array(TransportistaSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
})

export const TransportistasSchema = z.object({
    data: z.array(TransportistaSchema)
})

export type Transportista = z.infer<typeof TransportistaSchema>

export async function getTransportistasPaginated(page: number) {
    try {
        const url = `/api/carriers?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = TransportistasPaginatedSchema.safeParse(data);
        if(result.success){
            return result.data
        }else{
            throw new Error('Información no valida');
        }
    } catch (error) {
        console.log(error);
        throw error;
    };
}

export async function getAllTransportistas() : Promise<Transportista[]>{
    try {
        const url = `/api/carriers-all`;
        const { data } = await clienteAxios(url);
        const result = TransportistasSchema.safeParse(data);
        if(result.success){
            return result.data.data
        }else{
            throw new Error('Información no valida');
        }
    } catch (error) {
        console.log(error);
        throw error;
    };
}

export type DraftTransportista = {
    name: string,
    code: string
}

export async function createTransportista(data: DraftTransportista) {
    try {
        const url = '/api/carriers';
        await clienteAxios.post(url, data);
    } catch (error) {
        console.log(error);
        throw error;
    };
}