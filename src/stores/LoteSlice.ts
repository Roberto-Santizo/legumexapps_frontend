import { StateCreator } from 'zustand';
import { DraftLote, Lote } from '../types';
import clienteAxios from '../config/axios';
import { Lotes } from '../utils/lotes-schema';

export type LoteSliceType = {
    lotes: Lote[];

    loadingFetchLotes: boolean;
    loadingCreateLote: boolean;

    errorFetchLotes: boolean;
    errorCreateLote: boolean;

    errorsCreateLote: string[];

    fetchLotes: () => Promise<void>;
    createLote: (draftlote: DraftLote) => Promise<void>;
}

export const createLoteSlice: StateCreator<LoteSliceType> = (set) => ({
    lotes: [],
    loadingFetchLotes: false,
    loadingCreateLote: false,
    errorFetchLotes: false,
    errorCreateLote: false,
    errorsCreateLote: [],
    fetchLotes: async () => {
        set({ loadingFetchLotes: true });
        try {
            const url = '/api/lotes';
            const { data } = await clienteAxios(url)
            const result = Lotes.safeParse(data);
            if (result.success) {
                set({ loadingFetchLotes: false, errorFetchLotes: false, lotes: result.data.data })
            }
        } catch (error: any) {
            set({ loadingFetchLotes: false, errorFetchLotes: true })
        }
    },
    createLote: async (draftlote) => {
        set({ loadingCreateLote: true });
        try {
            const url = '/api/lotes';
            await clienteAxios.post(url, draftlote);

            set({ loadingCreateLote: false, errorCreateLote: false });
        } catch (error: any) {
            set({ loadingCreateLote: false, errorCreateLote: true, errorsCreateLote: Object.values(error.response.data.errors) });
            throw error;
        }

    }
})