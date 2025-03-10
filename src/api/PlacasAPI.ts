import clienteAxios from "@/config/axios";
import { z } from "zod";
import { Transportista } from "./TransportistasAPI";

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

export async function getPlacasPaginated(page: number) {
    try {
        const url = `/api/plates?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = PlacasPaginatedSchema.safeParse(data);
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

export async function getPlacasByCarrierId(id : Transportista['id']) : Promise<Placa[]>{
    try {
        const url = `/api/plates-by-carrier/${id}`;
        const { data } = await clienteAxios(url);
        const result = PlacasSchema.safeParse(data);
        if(result.success){
            return result.data.data
        }else{
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

export async function createPlaca(data: DraftPlaca) {
    try {
        await clienteAxios.post('/api/plates', data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}