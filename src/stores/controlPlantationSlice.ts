import { StateCreator } from 'zustand';
import clienteAxios from '../config/axios';
import { Crops, Plantations, Recipes } from '../utils/plantation-schema';
import { Crop, DraftCDP, Plantation, Recipe } from '../types';

export type ControlPlantationSliceType = {
    plantations: Plantation[];
    crops: Crop[];
    recipes: Recipe[];

    loadingfetchControlPlantations: boolean;
    loadingFetchCrop: boolean;
    loadingFetchRecipes: boolean;
    loadingCreateCDP: boolean;

    errorFetchControlPlantations: boolean;
    errorFetchCrops: boolean;
    errorFetchRecipes: boolean;
    errorCreateCDP:boolean;

    errorsCreateCDP: string[]

    fetchCrops: () => Promise<void>;
    fetchRecipes: () => Promise<void>;
    fetchControlPlantations: () => Promise<void>;
    createControlPlantation: (cdp : DraftCDP) => Promise<void>;
}

export const createControlPlantationSlice: StateCreator<ControlPlantationSliceType> = ((set) => ({
    plantations: [],
    crops: [],
    recipes: [],

    loadingfetchControlPlantations: false,
    loadingFetchCrop: false,
    loadingFetchRecipes: false,
    loadingCreateCDP: false,

    errorFetchControlPlantations: false,
    errorFetchCrops: false,
    errorFetchRecipes: false,
    errorCreateCDP: false,

    errorsCreateCDP: [],

    fetchControlPlantations: async () => {
        set({ loadingfetchControlPlantations: true });
        const url = 'http://127.0.0.1:8000/api/cdps';
        try {
            const { data } = await clienteAxios(url, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            });
            const result = Plantations.safeParse(data);
            if (result.success) {
                set({ loadingfetchControlPlantations: false, plantations: result.data.data });
            }
        } catch (error: any) {
            set({ loadingfetchControlPlantations: false, errorFetchControlPlantations: true });
        }
    },
    fetchCrops: async () => {
        set({ loadingFetchCrop: true });
        const url = 'http://127.0.0.1:8000/api/crops'
        try {
            const { data } = await clienteAxios(url, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            })
            const result = Crops.safeParse(data);
            if (result.success) {
                set({ loadingFetchCrop: false, crops: result.data.data });
            }
        } catch (error: any) {
            set({ loadingFetchCrop: false, errorFetchCrops: true })
        }
    },
    fetchRecipes: async () => {
        set({ loadingFetchRecipes: true });
        const url = 'http://127.0.0.1:8000/api/recipes'
        try {
            const { data } = await clienteAxios(url, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            })
            const result = Recipes.safeParse(data);
            if (result.success) {
                set({ loadingFetchRecipes: false, recipes: result.data.data });
            }
        } catch (error: any) {
            set({ loadingFetchRecipes: false, errorFetchRecipes: true })
        }
    },

    createControlPlantation: async (cdp) => {
        set({ loadingCreateCDP: true });
        const url = 'http://127.0.0.1:8000/api/cdps'
        try {
            await clienteAxios.post(url,cdp, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            })
            set({ loadingCreateCDP: false});
        } catch (error: any) {
            set({ loadingCreateCDP: false, errorCreateCDP: true, errorsCreateCDP: Object.values(error.response.data.errors) })
            throw error;
        }
    }
}));
