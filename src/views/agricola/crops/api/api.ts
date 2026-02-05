import { ApiResponseSchema } from "@/schemas/httpRequestsSchemas";
import { Crop, CropDisease, CropDiseaseImage, DraftCrop, DraftCropDisease, DraftCropDiseaseSymptom, DraftCropPart } from "../types";
import { CropDiseaseByIdResponseSchema, CropDiseaseImagesByIdResponseSchema, CropDiseaseResponseSchema, CropDiseaseSymptoResponseSchema, CropPartResponseSchema, CropsResponseSchema } from "../schemas/schemas";
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

export async function createCropPart(formData: DraftCropPart) {
    try {
        const url = `/api/crop-parts`
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

export async function getCropDiseases(id: CropDisease['id']) {
    try {
        const url = `/api/crop-disease?crop=${id}`
        const { data } = await clienteAxios.get(url);
        const result = CropDiseaseResponseSchema.safeParse(data);

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

export async function getCropDiseaseById(diseaseId: CropDisease['id']) {
    try {
        const url = `/api/crop-disease/${diseaseId}`
        const { data } = await clienteAxios.get(url);
        const result = CropDiseaseByIdResponseSchema.safeParse(data);

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

export async function getCropDiseaseImagesById(diseaseId: CropDisease['id']) {
    try {
        const url = `/api/crop-disease/images/${diseaseId}`
        const { data } = await clienteAxios.get(url);
        const result = CropDiseaseImagesByIdResponseSchema.safeParse(data);

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

export async function getCropDiseaseSymptonsById(diseaseId: CropDisease['id']) {
    try {
        const url = `/api/crop-disease-symptom?cropDisease=${diseaseId}`
        const { data } = await clienteAxios.get(url);
        const result = CropDiseaseSymptoResponseSchema.safeParse(data);

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

export async function addCropDiseaseImage({ id, image }: { id: CropDisease['id'], image: string }) {
    try {
        const url = `/api/crop-disease/addImage/${id}`
        const { data } = await clienteAxios.post(url, { image });
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

export async function deleteCropDiseaseImage(id: CropDiseaseImage['id']) {
    try {
        const url = `/api/crop-disease/images/${id}`
        const { data } = await clienteAxios.delete(url);
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

export async function createCropDisease(formData: DraftCropDisease) {
    try {
        const url = `/api/crop-disease`
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

export async function createCropDiseaseSymptom(formData: DraftCropDiseaseSymptom) {
    try {
        const url = `/api/crop-disease-symptom`
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