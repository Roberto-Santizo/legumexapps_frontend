import { StateCreator } from "zustand";
import { DraftQualityVariety, QualityVarietiesPaginate, QualityVariety } from "../types";
import clienteAxios from "../config/axios";
import { QualityVarietiesPaginateSchema, QualityVarietiesSchema } from "../utils/calidadVariedades-schema";

export type VariedadesSliceType = {
    getVarietiesPaginate: (page : number) => Promise<QualityVarietiesPaginate>;
    getAllVarieties: () => Promise<QualityVariety[]>;
    createCalidadVariedad: (data : DraftQualityVariety) => Promise<void>;
}

export const createVariedadesSlice: StateCreator<VariedadesSliceType> = () => ({
    getVarietiesPaginate:async (page) => {
        try {
            const url = `/api/quality-variety?page=${page}`;
            const {data} = await clienteAxios(url);
            const result = QualityVarietiesPaginateSchema.safeParse(data);
            if(result.success){
                return result.data
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    },
    getAllVarieties: async () => {
        try {
            const url = '/api/quality-variety-all';
            const {data} = await clienteAxios(url);
            const result = QualityVarietiesSchema.safeParse(data);
            if(result.success){
                return result.data.data
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    },
    createCalidadVariedad: async (data) => {
        try {
            const url = '/api/quality-variety';
            await clienteAxios.post(url,data);
        } catch (error) {
            throw error;
        }
    }
})