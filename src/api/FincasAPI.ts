import clienteAxios from "@/config/axios";
import { LoteSchema } from "@/utils/lotesSchemas";
import { z } from "zod";

export const DraftFincaSchema = z.object({
    name: z.string(),
    code: z.string()
});

export const FincaSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    terminal_id: z.number()
});


export const FincasSchema = z.object({
    data: z.array(FincaSchema)
});

export type Finca = z.infer<typeof FincaSchema>;
export type DraftFinca = z.infer<typeof DraftFincaSchema>;

export async function getFincas() {
    try {
        const url = '/api/fincas';
        const { data } = await clienteAxios(url)
        const result = FincasSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Existe un error al traer las fincas");
        }
    } catch (error) {
        throw error;
    }
}


export async function createFinca(payload: DraftFinca) {
    try {
        const url = '/api/fincas';
        const { data } = await clienteAxios.post(url, payload)
        
        return data;
    } catch (error) {
        throw error;
    }
}

export const LotesByFincaIdSchema = z.object({
    data: z.array(LoteSchema)
});

export async function getLotesByFincaId(id: Finca['id']) {
    try {
        const url = `/api/fincas/${id}`;
        const { data } = await clienteAxios(url);
        const result = LotesByFincaIdSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        throw error;
    }
}
