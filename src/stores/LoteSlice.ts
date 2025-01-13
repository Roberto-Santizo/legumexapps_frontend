import { StateCreator } from 'zustand';
import { Lote } from '../types';
import clienteAxios from '../config/axios';
import { Lotes } from '../utils/lotes-schema';

export type LoteSliceType = {
    lotes: Lote[];

    loadingFetchLotes: boolean;

    errorFetchLotes: boolean;
    fetchLotes: () => Promise<void>;
}

export const createLoteSlice: StateCreator<LoteSliceType> = (set) => ({
    lotes: [],
    loadingFetchLotes: false,
    errorFetchLotes: false,
    fetchLotes: async () => {
        set({ loadingFetchLotes: true });
        try {
            const url = 'http://127.0.0.1:8000/api/lotes';
            const { data } = await clienteAxios(url, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            })
            const result = Lotes.safeParse(data);
            if(result.success){
                set({loadingFetchLotes: false, errorFetchLotes: false, lotes: result.data.data})
            }
        } catch (error : any) {
            set({loadingFetchLotes: false, errorFetchLotes: true})
        }
    }
})