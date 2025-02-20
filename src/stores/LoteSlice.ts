import { StateCreator } from 'zustand';
import { CDP, DraftLote, Finca, Lote, loteCDPDetails, Lotes } from '../types';
import clienteAxios from '../config/axios';
import { LotesPaginateSchema, LotesSchema, LotesSchemaSelect } from '../utils/lotes-schema';
import { CDPsSchema } from '../utils/plantation-schema';
import { LoteCDPDetailsSchema } from '../utils/loteCDPDetails-schema';

export type LoteSliceType = {
    errorsCreateLote: string[];
    errorsUpdateLote: string[];

    fetchLotes: (page : number) => Promise<Lotes>;
    fetchAllLotes: () => Promise<Lote[]>
    createLote: (draftlote: DraftLote) => Promise<void>;
    fetchAllLotesByFincaId: (id: Finca['id']) => Promise<Lote[]>
    fetchAllCdpsByLoteId: (id: Lote['id']) => Promise<CDP[]>
    fetchCDPInfo: (lote_plantation_control_id: CDP['id']) => Promise<loteCDPDetails>
    updateLotes: (file : File[]) => Promise<void>
}

export const createLoteSlice: StateCreator<LoteSliceType> = (set) => ({
    errorsCreateLote: [],
    errorsUpdateLote: [],
    fetchLotes: async (page) => {
        try {
            const url = `/api/lotes?page=${page}`;
            const { data } = await clienteAxios(url)
            const result = LotesPaginateSchema.safeParse(data);
            if (result.success) {
                return result.data
            }else{
                throw new Error('Información no válida');
            }
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    },
    fetchAllLotes: async() => {
        try {
            const url = '/api/lotes-all';
            const { data } = await clienteAxios(url);
            const result = LotesSchema.safeParse(data);
            if(result.success){
                return result.data.data
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    fetchAllLotesByFincaId: async (id) => {
        try {
            const url = `/api/lotes/finca/${id}`;
            const { data } = await clienteAxios(url);
            const result = LotesSchemaSelect.safeParse(data);
            if(result.success){
                return result.data.data
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    fetchAllCdpsByLoteId: async (id) => {
        try {
            const url = `/api/cdps/lote/${id}`;
            const { data } = await clienteAxios(url);
            const result = CDPsSchema.safeParse(data);
            if(result.success){
                return result.data.data
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    fetchCDPInfo: async (id_cdp) => {
        try {
            const url = '/api/cdp/info';
            const { data } = await clienteAxios(url,{
                params: {lote_plantation_control_id: id_cdp }
            })
            const result = LoteCDPDetailsSchema.safeParse(data);
            if(result.success){
                return result.data
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    createLote: async (draftlote) => {
        try {
            const url = '/api/lotes';
            await clienteAxios.post(url, draftlote);
            set({errorsCreateLote: []});
        } catch (error: any) {
            console.log(error);
            set({errorsCreateLote: Object.values(error.response.data.errors)});
            throw error;
        }

    },
    updateLotes: async (file) => {
        try {
            const url = '/api/lotes-all/update';
            const formData = new FormData();
            formData.append("file", file[0]);
            await clienteAxios.post(url, formData);
            set({ errorsUpdateLote: []})
        } catch (error: any) {
            console.log(error);
            set({ errorsUpdateLote: error.response.data.message})
            throw error;
        }
    }
})