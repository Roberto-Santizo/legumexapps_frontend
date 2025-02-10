import { StateCreator } from 'zustand';
import clienteAxios from '../config/axios';
import { Crops, PlantationsPaginateSchema,PlantationsSchema, Recipes } from '../utils/plantation-schema';
import { Crop, DraftCDP, Plantation, PlantationsPaginate, Recipe } from '../types';

export type ControlPlantationSliceType = {
    errorsCreateCDP: string[];
    fetchCrops: () => Promise<Crop[]>;
    fetchRecipes: () => Promise<Recipe[]>;
    fetchControlPlantationsPaginate: (page: number) => Promise<PlantationsPaginate>;
    fetchControlPlantations: () => Promise<Plantation[]>;
    createControlPlantation: (cdp : DraftCDP) => Promise<void>;
    uploadCDPS: (file : File[]) => Promise<void>;
}

export const createControlPlantationSlice: StateCreator<ControlPlantationSliceType> = ((set) => ({
    errorsCreateCDP: [],

    fetchControlPlantationsPaginate: async (page) => {
        const url = `/api/cdps?page=${page}`;
        try {
            const { data } = await clienteAxios(url);
            const result = PlantationsPaginateSchema.safeParse(data);
            if (result.success) {
                return result.data
            }else{
                throw new Error("Error al traer los cdps");
            }
        } catch (error: any) {
            throw error;
        }
    },

    fetchControlPlantations: async () => {
        try {
            const url = `/api/cdps-list/all`;
            const { data } = await clienteAxios(url);
            const result = PlantationsSchema.safeParse(data);
            if (result.success) {
                return result.data.data
            }else{
                throw new Error("Error al traer los cdps");
            }
        } catch (error: any) {
            throw error;
        }
    },

    fetchCrops: async () => {
        const url = '/api/crops'
        try {
            const { data } = await clienteAxios(url)
            const result = Crops.safeParse(data);
            if (result.success) {
                return result.data.data
            }else{
                throw new Error("Información no válida");
            }
        } catch (error: any) {
            throw error;
        }
    },

    fetchRecipes: async () => {
        const url = '/api/recipes'
        try {
            const { data } = await clienteAxios(url)
            const result = Recipes.safeParse(data);
            if (result.success) {
                return result.data.data
            }else{
                throw new Error("La información no es válida");
            }
        } catch (error: any) {
            throw error;
        }
    },

    createControlPlantation: async (cdp) => {
        const url = '/api/cdps'
        try {
            await clienteAxios.post(url,cdp)
            set({ errorsCreateCDP: []});
        } catch (error: any) {
            set({errorsCreateCDP: Object.values(error.response.data.errors) })
            throw error;
        }
    },
    uploadCDPS: async (file) => {
        try {
            const url = '/api/cdps/upload';
            const formData = new FormData();
            formData.append("file", file[0]);
            await clienteAxios.post(url, formData);
            set({ errorsCreateCDP: []})
        } catch (error: any) {
            set({ errorsCreateCDP: error.response.data.message})
            throw error;
        }
    }
}));
