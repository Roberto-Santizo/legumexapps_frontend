import clienteAxios from "@/config/axios";
import { FincasSchema } from "@/utils/fincas-schema";

export async function getAllFincas() {
    try {
        const url = '/api/fincas';
        const { data } = await clienteAxios(url)
        const result = FincasSchema.safeParse(data);
        if(result.success){
            return result.data.data
        }else{
            throw new Error("Existe un error al traer las fincas");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}