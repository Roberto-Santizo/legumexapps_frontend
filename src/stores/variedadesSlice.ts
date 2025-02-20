import { StateCreator } from "zustand";
import { DraftVariety, VarietiesPaginate, Variety } from "../types";
import clienteAxios from "../config/axios";
import { VarietiesPaginateSchema, VarietiesSchema } from "../utils/calidadVariedades-schema";

export type VariedadesSliceType = {
    createVariety: (data : DraftVariety) => Promise<void>;
    getVarietiesPaginate: (page : number) => Promise<VarietiesPaginate>;
    getAllVarieties: () => Promise<Variety[]>;
}

export const createVariedadesSlice: StateCreator<VariedadesSliceType> = () => ({
    createVariety: async(data) => {
        try {
            const url = '/api/variety-products';
            await clienteAxios.post(url,data);
        } catch (error) {
            throw error;
        }
    },
    getVarietiesPaginate:async (page) => {
        try {
            const url = `/api/variety-products?page=${page}`;
            const {data} = await clienteAxios(url);
            const result = VarietiesPaginateSchema.safeParse(data);
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
            const url = '/api/variety-products-all';
            const {data} = await clienteAxios(url);
            const result = VarietiesSchema.safeParse(data);
            if(result.success){
                return result.data.data
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    }
})