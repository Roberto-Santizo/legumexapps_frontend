import { StateCreator } from "zustand";
import { Boleta, BoletaDetail, BoletasPaginate, DraftBoletaRMP } from "../types";
import clienteAxios from "../config/axios";
import { BoletaRMPDetailSchema, BoletasPaginateSchema } from "../utils/boletarmp-schema";

export type BoletasRecepcionType = {
    getBoletasRMP: () => Promise<BoletasPaginate>;
    createBoletaRMP: (data : DraftBoletaRMP) => Promise<string[]>;
    getBoletaRMPDetail: (id : Boleta['id']) => Promise<BoletaDetail>;
}

export const createBoletaRecepcionSlice: StateCreator<BoletasRecepcionType> = () => ({
    getBoletasRMP: async () => {
       try {
            const url = '/api/boleta-rmp';
            const { data } = await clienteAxios(url);
            const result = BoletasPaginateSchema.safeParse(data);
            if(result.success){
                return result.data
            }else{
                throw new Error("Información no válida");
            }
       } catch (error) {
            throw error;
       }
    },
    getBoletaRMPDetail: async (id) => {
        try {
            const url = `/api/boleta-rmp/${id}`;
            const { data } = await clienteAxios(url);
            const result = BoletaRMPDetailSchema.safeParse(data.data);
            if(result.success){
                return result.data
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    },

    createBoletaRMP: async (data) => {
        try {
            const url = '/api/boleta-rmp';
            await clienteAxios.post(url,data);
            return[];
        } catch (error : any) {
           return Object.values(error.response.data.errors);
        }
    }
})