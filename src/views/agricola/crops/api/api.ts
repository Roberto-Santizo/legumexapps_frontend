import { ApiResponseSchema } from "@/schemas/httpRequestsSchemas";
import { CropPartResponseSchema, CropsResponseSchema } from "../schemas/schemas";
import { Crop, DraftCrop } from "../types";
import { isAxiosError } from "axios";
import clienteAxios from "@/config/axios";

export async function getCrops() {
    try {
        const url = '/api/crops'
        const { data } = await clienteAxios.get(url);
        const result = CropsResponseSchema.safeParse(data);

        if (result.success) {
            return result.data.response;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }

        throw new Error("Error no controlado");
    }
}

export async function createCrop(formData: DraftCrop) {
    try {
        const url = '/api/crops'
        const { data } = await clienteAxios.post(url, formData);
        const result = ApiResponseSchema.safeParse(data);

        if (result.success) {
            return result.data.message;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }

        throw new Error("Error no controlado");
    }
}

export async function getCropParts(id: Crop['id']) {
    try {
        const url = `/api/crop-parts?crop=${id}`
        const { data } = await clienteAxios.get(url);
        const result = CropPartResponseSchema.safeParse(data);

        if(result.success){
            return result.data.response;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }

        throw new Error("Error no controlado");
    }
}