import clienteAxios from "@/config/axios";
import { z } from "zod";

export const ProductorCDPSchema = z.object({
    id: z.string(),
    name: z.string(),
    finca: z.string()
})

export const ProductorCDPSSchema = z.object({
    data: z.array(ProductorCDPSchema)
});

export type ProductorCDP = z.infer<typeof ProductorCDPSchema>


export async function getAllProductorCDPS() : Promise<ProductorCDP[]> {
    try {
        const url = '/api/productor-cdp';
        const { data } = await clienteAxios(url);
        const result = ProductorCDPSSchema.safeParse(data);
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