import clienteAxios from "@/config/axios";
import { Planta } from "@/types";
import { PlantasSchema } from "@/utils/plantas-schema";

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