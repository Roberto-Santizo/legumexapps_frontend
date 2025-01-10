import { StateCreator } from 'zustand';
import clienteAxios from '../config/axios';
import { Crops, Plantations } from '../utils/plantation-schema';
import { Crop, Plantation } from '../types';

export type ControlPlantationSliceType = {
    plantations: Plantation[];
    crops: Crop[];

    loadingfetchControlPlantations: boolean;
    loadingFetchCrop: boolean;

    errorFetchControlPlantations: boolean;
    errorFetchCrops: boolean;

    fetchCrops: () => Promise<void>;
    fetchControlPlantations: () => Promise<void>;
    createControlPlantation: () => Promise<void>;
}

export const createControlPlantationSlice: StateCreator<ControlPlantationSliceType> = ((set) => ({
    plantations: [],
    crops: [],
    loadingfetchControlPlantations: false,
    loadingFetchCrop: false,

    errorFetchControlPlantations: false,
    errorFetchCrops: false,

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
    createControlPlantation: async () => {
        console.log()
    }
}));
