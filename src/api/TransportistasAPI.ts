import clienteAxios from "@/config/axios";
import { z } from "zod";
import { PilotoSchema } from "./PilotosAPI";
import { PlacaSchema } from "./PlacasAPI";

export const TransportistaSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    drivers: z.array(PilotoSchema),
    plates: z.array(PlacaSchema),
})

export const TransportistasPaginatedSchema = z.object({
    data: z.array(TransportistaSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    }).optional()
})

export type Transportista = z.infer<typeof TransportistaSchema>;

export async function getTransportistas({ page, paginated }: { page: number, paginated: string }) {
    try {
        const url = `/api/carriers?paginated=${paginated}&page=${page}`;
        const { data } = await clienteAxios(url);
        const result = TransportistasPaginatedSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
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

export async function getTransportistaInfoById(id: Transportista['id']): Promise<Transportista> {
    try {
        const url = `/api/carriers/${id}`;
        const { data } = await clienteAxios(url);
        const result = TransportistaSchema.safeParse(data.data);
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
