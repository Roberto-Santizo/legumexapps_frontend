import clienteAxios from "@/config/axios";
import { Crop, DraftCDP, Plantation, PlantationsPaginate, Recipe } from "@/types";
import { CropsSchema, PlantationsPaginateSchema, PlantationsSchema, Recipes } from "@/utils/plantation-schema";

export async function createCDP(cdp: DraftCDP): Promise<void | string[]> {
    try {
        const url = '/api/cdps'
        await clienteAxios.post(url, cdp)
    } catch (error: any) {
        console.log(error);
        return Object.values(error.response.data.errors);
    }
}

export async function uploadCDPS(file : File[]) : Promise<void | string[]>{
    try {
        const url = '/api/cdps/upload';
        const formData = new FormData();
        formData.append("file", file[0]);
        await clienteAxios.post(url, formData);
    } catch (error: any) {
        console.log(error);
        return error.response.data.message;
    }
}

export async function getPaginatedCDPS(page: number): Promise<PlantationsPaginate> {
    try {
        const url = `/api/cdps?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = PlantationsPaginateSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Error al traer los cdps");
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

export async function getCDPS(): Promise<Plantation[]> {
    try {
        const url = `/api/cdps-list/all`;
        const { data } = await clienteAxios(url);
        const result = PlantationsSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Error al traer los cdps");
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

export async function getCrops(): Promise<Crop[]> {
    try {
        const url = '/api/crops'
        const { data } = await clienteAxios(url)
        const result = CropsSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

export async function getRecipes(): Promise<Recipe[]> {
    try {
        const url = '/api/recipes'
        const { data } = await clienteAxios(url)
        const result = Recipes.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("La información no es válida");
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}