import { StateCreator } from 'zustand';
import { DraftLote, Lotes } from '../types';
import clienteAxios from '../config/axios';
import { LotesSchema } from '../utils/lotes-schema';

export type LoteSliceType = {
    errorsCreateLote: string[];

    fetchLotes: (page : number) => Promise<Lotes>;
    createLote: (draftlote: DraftLote) => Promise<void>;
}

export const createLoteSlice: StateCreator<LoteSliceType> = (set) => ({
    errorsCreateLote: [],
    fetchLotes: async (page) => {
        try {
            const url = `/api/lotes?page=${page}`;
            const { data } = await clienteAxios(url)
            const result = LotesSchema.safeParse(data);
            if (result.success) {
                return result.data
            }else{
                throw new Error('Información no válida');
            }
        } catch (error: any) {
            throw error;
        }
    },
    createLote: async (draftlote) => {
        try {
            const url = '/api/lotes';
            await clienteAxios.post(url, draftlote);
            set({errorsCreateLote: []});
        } catch (error: any) {
            set({errorsCreateLote: Object.values(error.response.data.errors)});
            throw error;
        }

    }
})