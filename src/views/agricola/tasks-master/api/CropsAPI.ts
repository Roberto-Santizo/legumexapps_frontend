import clienteAxios from "@/config/axios";
import { CropsSchema } from "../schemas";
import { isAxiosError } from "axios";
import { DraftCrop } from "../types";
import { ApiResponseSchema } from "@/schemas/httpRequestsSchemas";

export async function getCrops() {
    try {
        const url = '/api/crops';
        const response = await clienteAxios(url);

        const result = CropsSchema.safeParse(response.data);
        if(result.success){
            return result.data.data;
        }else{
            throw new Error("Hubo un error");
        }
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.message);
        }
    }
}

export async function createCrop(data : DraftCrop) {
    try {
        const url = '/api/crops';
        const response = await clienteAxios.post(url, data);

        const result = ApiResponseSchema.safeParse(response.data);
        if(result.success){
            return result.data.message;
        }else{
            throw new Error("Hubo un error");
        }
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.message);
        }
    }
}