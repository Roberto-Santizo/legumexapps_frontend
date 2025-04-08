import clienteAxios from "@/config/axios";
import { z } from "zod";


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