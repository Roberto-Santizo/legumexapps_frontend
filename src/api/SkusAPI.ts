import clienteAxios from "@/config/axios";
import { z } from "zod";

export const SKUSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    unit_mesurment: z.string()
});

export const SkusPaginatedSchema = z.object({
    data: z.array(SKUSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

export type SKU = z.infer<typeof SKUSchema>;
export type SkusPaginated = z.infer<typeof SkusPaginatedSchema>

export async function getSkusPaginated(page : number) : Promise<SkusPaginated>{
    try {
        const url = `/api/sku?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = SkusPaginatedSchema.safeParse(data);
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

export type DraftSku = {
    code: string,
    name: string,
    unit_mesurment: string
}

export async function createSKU(data : DraftSku) {
    try {
        const url = '/api/sku';
        await clienteAxios.post(url,data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}