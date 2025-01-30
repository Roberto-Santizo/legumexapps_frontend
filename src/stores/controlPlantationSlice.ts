import { StateCreator } from 'zustand';
import clienteAxios from '../config/axios';
import { Crops, PlantationsSchema, Recipes } from '../utils/plantation-schema';
import { Crop, DraftCDP, Plantation, Plantations, Recipe } from '../types';

export type ControlPlantationSliceType = {
    errorsCreateCDP: string[]

    fetchCrops: () => Promise<Crop[]>;
    fetchRecipes: () => Promise<Recipe[]>;
    fetchControlPlantationsPaginate: (page: number) => Promise<Plantations>;
    fetchControlPlantations: () => Promise<Plantation[]>
    createControlPlantation: (cdp : DraftCDP) => Promise<void>;
}

export const createControlPlantationSlice: StateCreator<ControlPlantationSliceType> = ((set) => ({
    errorsCreateCDP: [],

    fetchControlPlantationsPaginate: async (page) => {
        const url = `/api/cdps?page=${page}`;
        try {
            const { data } = await clienteAxios(url);
            const result = PlantationsSchema.safeParse(data);
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
        const url = `/api/cdps`;
        try {
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
    }
}));
