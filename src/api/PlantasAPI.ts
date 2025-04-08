import clienteAxios from "@/config/axios";
import { z } from "zod";

export const PlantaSchema = z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable()
});

export const PlantasSchema = z.object({
    data: z.array(PlantaSchema)
});

export type Planta = z.infer<typeof PlantaSchema>

export async function getAllPlantas() : Promise<Planta[]>{
    try {
        const url = '/api/plantas';
        const { data } = await clienteAxios(url);
        const result = PlantasSchema.safeParse(data);
        if(result.success){
            return result.data.data
        }else{
            throw new Error('Información no válida');
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}