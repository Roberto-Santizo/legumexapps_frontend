import clienteAxios from "@/config/axios"
import { z } from "zod";
import { Transportista } from "./TransportistasAPI";

export type DraftPiloto = {
    name: string,
    dpi: string,
    license: string,
    carrier_id: string,
}

export async function createPiloto(data : DraftPiloto) {
    try {
        await clienteAxios.post('/api/drivers',data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const PilotoSchema = z.object({
    id: z.string(),
    name: z.string(),
    dpi: z.string().nullable(),
    license: z.string().nullable(),
    carrier: z.string()
});

export const PilotosPaginatedSchema = z.object({
    data: z.array(PilotoSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

export const PilotosSchema = z.object({
    data: z.array(PilotoSchema)
})

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

export async function getPilotosByTransportistaId(id : Transportista['id']) : Promise<Piloto[]> {
    try {
        const url = `/api/drivers-by-carrier/${id}`;
        const { data } = await clienteAxios(url);
        const result = PilotosSchema.safeParse(data);
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