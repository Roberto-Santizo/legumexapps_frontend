import clienteAxios from "@/config/axios";
import { DraftVariety, VarietiesPaginate } from "@/types";
import { VarietiesPaginateSchema, VarietiesSchema } from "@/utils/calidadVariedades-schema";

export async function createVariety(data : DraftVariety) : Promise<void>{
    try {
        const url = '/api/variety-products';
        await clienteAxios.post(url,data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getPaginatedVarieties(page:number) : Promise<VarietiesPaginate> {
    try {
        const url = `/api/variety-products?page=${page}`;
        const {data} = await clienteAxios(url);
        const result = VarietiesPaginateSchema.safeParse(data);
        if(result.success){
            return result.data
        }else{
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllVarieties() {
    try {
        const url = '/api/variety-products-all';
        const {data} = await clienteAxios(url);
        const result = VarietiesSchema.safeParse(data);
        if(result.success){
            return result.data.data
        }else{
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}